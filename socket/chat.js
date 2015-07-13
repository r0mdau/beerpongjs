'use strict';

exports.launch = function (io) {
    var nsp = io.of('/chat');

    var usernames = {};
    var numUsers = 0;

    nsp.on('connection', function (socket) {
        var addedUser = false;

        socket.on('new message', function (data) {
            socket.broadcast.emit('new message', {
                username: socket.username,
                message: data
            });
        });

        socket.on('add user', function (username) {
            socket.username = username;
            usernames[username] = username;
            ++numUsers;
            addedUser = true;
            socket.emit('login', {
                numUsers: numUsers
            });
            socket.broadcast.emit('user joined', {
                username: socket.username,
                numUsers: numUsers
            });
        });

        socket.on('typing', function () {
            socket.broadcast.emit('typing', {
                username: socket.username
            });
        });

        socket.on('stop typing', function () {
            socket.broadcast.emit('stop typing', {
                username: socket.username
            });
        });

        socket.on('disconnect', function () {
            if (addedUser) {
                delete usernames[socket.username];
                --numUsers;

                socket.broadcast.emit('user left', {
                    username: socket.username,
                    numUsers: numUsers
                });
            }
        });
    });
};
