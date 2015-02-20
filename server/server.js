var io = require('socket.io').listen(8001);

var players = {};

function pairOfPlayers(id) {
    if (!players[id].associatedId) {
        return 1;
    } else {
        return 2;
    }
}

io.sockets.on('connection', function (socket) {
    var nick = socket.id.substr(0, 4);
    players[socket.id] = {
        canPlay: false,
        nick: nick
    };

    socket.emit('nickname', nick);

    players[socket.id].canPlay = false;
    socket.emit('canPlay', 'false');

    for (var id in players) {
        if (players.hasOwnProperty(id) && !players[id].associatedId && id != socket.id) {
            players[id].associatedId = socket.id;
            players[socket.id].associatedId = id;

            players[id].canPlay = true;
            socket.broadcast.to(id).emit('canPlay', 'true');
            socket.emit('canPlay', 'false');

            socket.emit('oNick', players[id].nick);
            socket.broadcast.to(id).emit('oNick', nick);

            break;
        }
    }

    socket.emit('players', pairOfPlayers(socket.id));
    socket.broadcast.to(players[socket.id].associatedId).emit('players', pairOfPlayers(socket.id));

    console.log(socket.id + ' : connected');

    socket.on('velocity', function (msg) {
        if (players[this.id].canPlay && players[this.id].associatedId) {
            this.broadcast.to(players[this.id].associatedId).emit('velocity', msg);
            this.broadcast.to(players[this.id].associatedId).emit('canPlay', 'true');

            players[this.id].canPlay = false;
            if (players[players[this.id].associatedId]) {
                players[players[this.id].associatedId].canPlay = true;
            }

            console.log(this.id + ' : ' + msg);
        }
    });

    socket.on('removeCup', function (index) {
        this.broadcast.to(players[this.id].associatedId).emit('cupToRemove', index);
    });

    socket.on('disconnect', function () {
        if (players[this.id].associatedId) {
            players[players[this.id].associatedId].canPlay = true;
            delete players[players[this.id].associatedId].associatedId;
            this.broadcast.to(players[this.id].associatedId).emit('canPlay', 'true');
            this.broadcast.to(players[this.id].associatedId).emit('players', pairOfPlayers(this.id));
        }
        delete players[this.id];

        console.log(this.id + ' : disconnected');
    });
});