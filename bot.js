var express = require('express.io'),
    Twit = require('twit');

var server = express();

server.set('port', (process.env.PORT || 5000));


server.listen(server.get('port'), function() {
    console.log("Node app is running at localhost:" + server.get('port'));
});
