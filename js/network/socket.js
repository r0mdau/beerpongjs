'use strict';

$(document).ready(function(){
    socket = io('http://webservice.ovh:8001');
    socket.on('canPlay', function (bool) {
        canPlay = eval(bool);
        if(canPlay){
            $('#yourTurnMessage').show();
            game.reset();
        }
    });

    socket.on('nickname', function (nick) {
        $('#commande').append($('<p>').text(
            'Votre identifiant : ' + nick
        ))
    });

    socket.on('oNick', function (nick) {
        $('#commande').append($('<p>').text(
            'Adversaire : ' + nick
        ));
    });

    socket.on('players', function (nb) {
        if (parseInt(nb) < 2) {
            $('#missingPlayer').show();
        } else {
            $('#missingPlayer').hide();
        }
    });

    socket.on('velocity', function (velocity) {
        ball.resetAtPosition({x: 0, y: 15, z: -44});
        velocity = JSON.parse(velocity);
        ball.launch({x: -velocity.x, y: velocity.y, z: -velocity.z});
        game.unPause();
    });

    socket.on('cupToRemove', function (index) {
        game.removeMyCup(index);
        game.reset();
    });
});