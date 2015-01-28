var _ = require('lodash');


var data = [];

var add = function (name, text) {
  Tweet.create({UserId: 10, tweet: text});
};

var list = function () {
  return _.clone(data);
};

var find = function (properties) {
  return _.where(data, properties);
};

// User.find(123).complete(function(err, user) {
//     user.getTweets().complete(function(err, tweets) {
//         console.log(tweets);
//   })
// });

module.exports = { add: add, list: list, find: find };
