var router = require('express').Router();
var User = require('../models').User;
var Tweet = require('../models').Tweet;

var tweetBank = require('../tweetBank');

function routes (io) {
	router.get('/', function (req, res) {
		Tweet.findAll({include: User}).then(function(result){
			res.render('index', {
				title: 'Twitter.js - all tweets',
				showForm: true,
				tweets: result
			});
		});
	});

	router.get('/users/:name', function (req, res) {
		var userName = req.params.name;
		User.find({ where: {name: userName} }).then(function(userRes){
			userRes.getTweets({include: User}).then(function(tweetRes){
				// res.json(tweetRes);
				res.render('index', {
					title: "Twitter.js - " + tweetRes[0].User.name + "'s Tweets",
					showForm: true,
					tweets: tweetRes
				});			
			});	
		});	
	});

	router.get('/users/:name/tweets/:id', function (req, res) {
		var userName = req.params.name,
			tweetId = parseInt(req.params.id);
		Tweet.find({where: {id: tweetId}, include: User}).then(function(tweetRes){
			// ***** Why does it render more than one tweet?
			res.render('index', {
				title: "Twitter.js - " + tweetRes.User.name + "'s Tweets",
				showForm: true,
				tweets: tweetRes
			});	
		});
	});

	router.post('/submit', function (req, res) {
		var tweetName = req.body.name,
			tweetText = req.body.text;
		User.findOrCreate({where: {name: tweetName}, defaults: {name: tweetName}})
			.then(function(user){
				// ***** Why does this pass two arguments when other functions don't?
				Tweet.create({UserId: user[0].id, tweet: tweetText}).then(function(newTweet){
					io.sockets.emit('new_tweet', newTweet);
					res.redirect('/');	
				});
		});
	});
	return router;
}


module.exports = routes;