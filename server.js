var express = require('express');
var app = express();
var server = app.listen(8001);
var io = require('socket.io').listen(server);
var env = require('./env');

app
    .set('view engine', 'jade')
;

app
    .get('/', function (req, res) {
        res.render('index.jade', {env: env});
    })
    .get('/chat', function (req, res) {
        res.render('chat.jade', {env: env});
    })
;

app
    .use('/assets', express.static(__dirname + '/assets'))
    .use('/js', express.static(__dirname + '/js'))
    .use(function(req, res){
        res.redirect('/');
    })
;

require('./socket/game.js').launch(io);
require('./socket/chat.js').launch(io);
