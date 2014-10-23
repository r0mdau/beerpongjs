var io = require('socket.io').listen(8000);

io.sockets.on('connection', function (socket) {
    var nick = socket.id.substr(0, 4);
    console.log(nick + ' connected on chat');
    socket.on('chat message', function (msg) {
        var message = nick + ' : ' + msg;
        console.log(message);
        io.emit('chat message', message);
    });
    socket.on('disconnect', function () {
        console.log(nick + ' disconnected');
    });
});