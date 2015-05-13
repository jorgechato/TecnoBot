var express = require('express.io'),
    Twit = require('twit');

var config = require('../config.json');

var server = express();

server.set('port', (process.env.PORT || 5000));

var boot = new Twit({
    consumer_key: process.env.consumer_key || config.env.consumer_key,
    consumer_secret: process.env.consumer_secret || config.env.consumer_secret,
    access_token: process.env.access_token || config.env.access_token,
    access_token_secret: process.env.access_token_secret || config.env.access_token_secret
});

//
//  tweet 'hello world!'
//
boot
.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
    console.log(data);
})

//
//  search twitter for all tweets containing the word 'banana' since Nov. 11, 2011
//
.get('search/tweets', { q: 'banana since:2011-11-11', count: 100 }, function(err, data, response) {
    console.log(data);
})

//
//  get the list of user id's that follow @tolga_tezel
//
.get('followers/ids', { screen_name: 'tolga_tezel' },  function (err, data, response) {
    console.log(data);
})

//
//  retweet a tweet with id '343360866131001345'
//
.post('statuses/retweet/:id', { id: '343360866131001345' }, function (err, data, response) {
    console.log(data);
})

//
//  destroy a tweet with id '343360866131001345'
//
.post('statuses/destroy/:id', { id: '343360866131001345' }, function (err, data, response) {
    console.log(data);
})

//
// get `funny` twitter users
//
.get('users/suggestions/:slug', { slug: 'funny' }, function (err, data, response) {
    console.log(data);
});

//
// post a tweet with media
//
var b64content = fs.readFileSync('/path/to/img', { encoding: 'base64' });

// first we must post the media to Twitter
boot
.post('media/upload', { media: b64content }, function (err, data, response) {

    // now we can reference the media and post a tweet (media will attach to the tweet)
    var mediaIdStr = data.media_id_string;
    var params = { status: 'loving life #nofilter', media_ids: [mediaIdStr] };

    boot.post('statuses/update', params, function (err, data, response) {
        console.log(data);
    });
});

//
//  stream a sample of public statuses
//
var stream = boot.stream('statuses/sample');

stream.on('tweet', function (tweet) {
    console.log(tweet);
});

//
//  filter the twitter public stream by the word 'mango'.
//
var stream = boot.stream('statuses/filter', { track: 'mango' });

stream.on('tweet', function (tweet) {
    console.log(tweet);
});

//
// filter the public stream by the latitude/longitude bounded box of San Francisco
//
var sanFrancisco = [ '-122.75', '36.8', '-121.75', '37.8' ];

var stream = boot.stream('statuses/filter', { locations: sanFrancisco });

stream.on('tweet', function (tweet) {
    console.log(tweet);
});

//
// filter the public stream by english tweets containing `#apple`
//
var stream = boot.stream('statuses/filter', { track: '#apple', language: 'en' });

stream.on('tweet', function (tweet) {
    console.log(tweet);
});

server.listen(server.get('port'), function() {
    console.log("Node app is running at localhost:" + server.get('port'));
});
