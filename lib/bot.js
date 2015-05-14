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
            return {q: 'github.com/',since: datestring(),result_type: 'mixed',language: 'en'};
        }else{
            return {q: 'tcrn.ch/',since: datestring(),result_type: 'mixed'};
        }
    }
    //Tuesday business
    if(today.getDay() == 2){
        if(getRandomInt(1,2) == 1){
            return {q: 'hbr.org/',since: datestring(),result_type: 'mixed'};
        }else{
            return {q: 'mitsmr.com/',since: datestring(),result_type: 'mixed'};
        }
    }
    //Wednesday marketing
    if(today.getDay() == 3){
        if(getRandomInt(1,2) == 1){
            return {q: 'CEO',since: datestring(),result_type: 'mixed',language: 'en'};
        }else{
            return {q: 'company',since: datestring(),result_type: 'mixed',language: 'en'};
        }
    }
    //Thursday hack
    if(today.getDay() == 4){
        switchTweet = getRandomInt(1,3);
        if(switchTweet == 1){
            return {q: 'angularjs',since: datestring(),result_type: 'mixed',language: 'en'};
        }else if(switchTweet == 2){
            return {q: '#startup',since: datestring(),result_type: 'mixed',language: 'en'};
        }else return {q: 'nodejs',since: datestring(),result_type: 'mixed',language: 'en'};
    }
    //Friday,Saturday and Sunday hobby
    if(today.getDay() == 5 || today.getDay() == 6 || today.getDay() == 7){
        switchTweet = getRandomInt(1,12);
        if(switchTweet >= 8){
            return {q: 't.ted.com/',since: datestring(),result_type: 'mixed',language: 'en'};
        }else if(switchTweet < 8 && switchTweet >= 4){
            return {q: 'samaltman.com/',since: datestring(),result_type: 'mixed'};
        }else return {q: 'nasa',since: datestring(),result_type: 'mixed',language: 'es'};
    }
}

setInterval(function() {
    bot.get('followers/ids', function(err, reply) {
      if(err) return handleError(err);
      if(needLogs === true) logger.info('\n# followers:' + reply.ids.length.toString());
    });

    bot.get('search', getParams(), function (err, reply) { //get the most popular tweet
        if(err) return handleError(err);

        var max = 0,
            popular;

        var tweets = reply.results;

        for(i = 0 ; i < tweets.length ; i++){
            var tweet = tweets[i],
                popularity = tweet.metadata.recent_retweets;

            if(popularity > max) {
                max = popularity;
                popular = tweet.text;
            }
        }

        bot.tweet(popular, function (err, reply) { //post the tweet you searched before
            if(err) return handleError(err);
            if(needLogs === true) logger.info('\nTweet: ' + (reply ? reply.text : reply));
        });
    });
}, interval);

setInterval(function() {
    bot.get('followers/ids', function(err, reply) {
      if(err) return handleError(err);
      if(needLogs === true) logger.info('\n# followers:' + reply.ids.length.toString());
    });
    if(getRandomInt(1,2) == 1) {
      bot.mingle(function(err, reply) { //follow
        if(err) return handleError(err);

        var name = reply.screen_name;
        if(needLogs === true) logger.info('\nMingle: followed @' + name);
      });
    } else {
      bot.prune(function(err, reply) { //unfollow
        if(err) return handleError(err);

        var name = reply.screen_name;
        if(needLogs === true) logger.info('\nPrune: unfollowed @'+ name);
      });
    }
}, interval/4);

server.listen(server.get('port'), function() {
    console.log("Node app is running at localhost:" + server.get('port'));
    if(needLogs === true) logger.info("Node app is running at localhost:" + server.get('port'));
});

function handleError(err) {
  if(needLogs === true) logger.info('response status:', err.statusCode);
  if(needLogs === true) logger.info('data:', err.data);
}
