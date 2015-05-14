var express = require('express.io'),
    Twit = require('twit'),
    winston = require('winston');
//change to false if you haven't papertrailapp.com account
var needLogs = true;

if(process.env.consumer_key === undefined){
    var config = require('../config.json');
    if(needLogs === true) var logConfig = require('../logConfig.json');
}
var server = express();

if(needLogs === true){
    var Papertrail = require('winston-papertrail').Papertrail;

    var logger = new winston.Logger({
        transports: [
            new winston.transports.Papertrail({
                host: process.env.url_log || logConfig.env.url_log,
                port: process.env.port_log || logConfig.env.port_log,
                logFormat: function(level, message) {
                    return '<<<' + level + '>>> ' + message;
                }
            })
        ]
    });
}

server.set('port', (process.env.PORT || 5000));

var bot = new Twit({
    consumer_key: process.env.consumer_key || config.env.consumer_key,
    consumer_secret: process.env.consumer_secret || config.env.consumer_secret,
    access_token: process.env.access_token || config.env.access_token,
    access_token_secret: process.env.access_token_secret || config.env.access_token_secret
});
//interval 1 day
var interval = 86400000;
//get date as twitter do
function datestring () {
    var now = new Date();
    return now.getUTCFullYear() + '-' + (now.getUTCMonth() + 1) + '-' + now.getDate();
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
//params to publish a tweet
function getParams(){
    var today = new Date();
    var switchTweet;
    //Monday new tech
    if(today.getDay() == 1){
        if(getRandomInt(1,2) == 1){
            return {q: 'github.com/',since: datestring(),language: 'en'};
        }else{
            return {q: 'tcrn.ch/',since: datestring()};
        }
    }
    //Tuesday business
    if(today.getDay() == 2){
        if(getRandomInt(1,2) == 1){
            return {q: 'hbr.org/',since: datestring()};
        }else{
            return {q: 'mitsmr.com/',since: datestring()};
        }
    }
    //Wednesday marketing
    if(today.getDay() == 3){
        if(getRandomInt(1,2) == 1){
            return {q: 'CEO',since: datestring(),language: 'en'};
        }else{
            return {q: 'company',since: datestring(),language: 'en'};
        }
    }
    //Thursday hack
    if(today.getDay() == 4){
        switchTweet = getRandomInt(1,3);
        if(switchTweet == 1){
            return {q: '#angularjs',since: datestring(),language: 'en'};
        }else if(switchTweet == 2){
            return {q: '#startup',since: datestring(),language: 'en'};
        }else return {q: '#nodejs',since: datestring(),language: 'en'};
    }
    //Friday,Saturday and Sunday hobby
    if(today.getDay() == 5 || today.getDay() == 6 || today.getDay() == 7){
        switchTweet = getRandomInt(1,12);
        if(switchTweet >= 8){
            return {q: 't.ted.com/',since: datestring(),language: 'en'};
        }else if(switchTweet < 8 && switchTweet >= 4){
            return {q: 'samaltman.com/',since: datestring()};
        }else return {q: 'nasa',since: datestring(),language: 'es'};
    }
}

setInterval(function() {
    bot.get('followers/ids', function(err, reply) {
      if(err) return handleError(err);
      if(needLogs === true) logger.info('\n# followers:' + reply.ids.length.toString());
    });

    bot.get('search/tweets', getParams(), function (err, reply) { //get the most popular tweet
        if(err) return handleError(err);

        var max = 0,
            popular;

        var tweets = reply.statuses;

        for(i = 0 ; i < tweets.length ; i++){
            var tweet = tweets[i],
                popularity = tweet.retweet_count;

            if(popularity > max) {
                max = popularity;
                popular = tweet.text;
            }
        }

        bot.post('statuses/update', { status: popular }, function(err, data, response) {
            if(err) return handleError(err);
            if(needLogs === true) logger.info('\nTweet: ' + (reply ? reply.text : reply));
        });
    });
}, interval);
//
// setInterval(function() {
//     bot.get('followers/ids', function(err, reply) {
//       if(err) return handleError(err);
//       if(needLogs === true) logger.info('\n# followers:' + reply.ids.length.toString());
//     });
//     if(getRandomInt(1,2) == 1) {
//       bot.prototype.mingle = function (callback) { //follow a random follower of your friends
//         bot.get('followers/ids', function(err, reply) {
//             if(err) { return callback(err); }
//
//             var followers = reply.ids,
//                 randFollower  = randIndex(followers);
//
//             bot.get('friends/ids', { user_id: randFollower }, function(err, reply) {
//                 if(err) { return callback(err); }
//
//                 var friends = reply.ids,
//                     target  = randIndex(friends);
//
//                 if(needLogs === true) logger.info('\nFriend: follow @'+ reply.screen_name);
//
//                 bot.post('friendships/create', { id: target }, callback);
//             });
//         });
//       };
//     } else {
//       bot.prototype.prune = function (callback) { //unfollow wich is not following you
//         bot.get('followers/ids', function(err, reply) {
//             if(err) return callback(err);
//
//             var followers = reply.ids;
//
//             bot.get('friends/ids', function(err, reply) {
//                 if(err) return callback(err);
//
//                 var friends = reply.ids,
//                     pruned = false;
//
//                 while(!pruned) {
//                   var target = randIndex(friends);
//
//                   if(!~followers.indexOf(target)) {
//                     pruned = true;
//                     bot.post('friendships/destroy', { id: target }, callback);
//                     if(needLogs === true) logger.info('\nPurge: unfollow @'+ reply.screen_name);
//                   }
//                 }
//             });
//         });
//       };
//     }
// }, interval/4);

server.listen(server.get('port'), function() {
    console.log("Node app is running at localhost:" + server.get('port'));
    if(needLogs === true) logger.info("Node app is running at localhost:" + server.get('port'));
});

function handleError(err) {
  if(needLogs === true) logger.info('response status:', err.statusCode);
  if(needLogs === true) logger.info('data:', err.data);
}
