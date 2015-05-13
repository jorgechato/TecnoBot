var express = require('express.io'),
    Twit = require('twit');

if(process.env.consumer_key === undefined){
    var config = require('../config.json');
}

var server = express();

server.set('port', (process.env.PORT || 5000));

var boot = new Twit({
    consumer_key: process.env.consumer_key || config.env.consumer_key,
    consumer_secret: process.env.consumer_secret || config.env.consumer_secret,
    access_token: process.env.access_token || config.env.access_token,
    access_token_secret: process.env.access_token_secret || config.env.access_token_secret
});

// boot
// .post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
//     console.log(data);
// });
function datestring () {
    var now = new Date();
    return now.getUTCFullYear() + '-' + (now.getUTCMonth() + 1) + '-' + now.getDate();
}

setInterval(function() {
    console.log(datestring());
}, 86400000);

server.listen(server.get('port'), function() {
    console.log("Node app is running at localhost:" + server.get('port'));
});
