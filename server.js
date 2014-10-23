var io = require('socket.io').listen(80);

var players = [];
var haveToPlay = 0;

function nextPlayer(number) {
    return number == 0 ? 1 : 0;
}

io.sockets.on('connection', function (socket) {
    if (players.length <= 2) {
        players.push(socket.id);
        if (socket.id == players[haveToPlay]) {
            socket.emit('canPlay', 'true');
            socket.broadcast.emit('canPlay', 'false');
        } else {
            socket.emit('canPlay', 'false');
            socket.broadcast.emit('canPlay', 'true');
        }
        io.emit('players', players.length);
        console.log('user connected');

        socket.on('velocity', function (msg) {
            if (this.id == players[haveToPlay]) {
                socket.broadcast.emit('canPlay', 'true');
                console.log(msg);
                this.broadcast.emit('velocity', msg);
                haveToPlay = nextPlayer(haveToPlay);
            }
        });

        socket.on('disconnect', function () {
            for (var i = 0; i < players.length; i++) {
                if (players[i] == socket.id) {
                    players.splice(i, 1);
                    haveToPlay = 0;
                    break;
                }
            }
            this.broadcast.emit('players', players.length);
            console.log('user disconnected');
        });
    }
});