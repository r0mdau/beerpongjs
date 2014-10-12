'use strict';

function playWhenMyKeyIsPressed(event){
    if (keyMap("r", event)) {
        myScreen.replayMessage.hide();
        game.replay();
    }else if (event.keyCode == 13) { // enter
        $('#nbtir').text(parseInt($('#nbtir').text()) + 1);
        ball.launch({x: $('#direction').val(), y: 2, z: -$('#puissance').val()});
        game.unPause();
    }else if (keyMap("a", event)) { // CHEAT POUR TESTS
        $('#nbtir').text(parseInt($('#nbtir').text()) + 1);
        ball.launch({x: 0, y: 2, z: -32.5});
        game.unPause();
    }else if (keyMap("z", event)) { // CHEAT POUR TESTS
        $('#nbtir').text(parseInt($('#nbtir').text()) + 1);
        ball.launch({x: -3.5, y: 2, z: -39});
        game.unPause();
    }else if (keyMap("e", event)) { // CHEAT POUR TESTS
        $('#nbtir').text(parseInt($('#nbtir').text()) + 1);
        ball.launch({x: 3.5, y: 2, z: -39});
        game.unPause();
    }
}

function doThingsWhenMyKeyIsPressed(event){
    var dir = $('#direction');
    var dirVal = parseInt(dir.val());
    var dirMin = parseInt(dir.attr('min'));
    var dirMax = parseInt(dir.attr('max'));

    if (keyMap("i", event)) {
        game.init();
    }else if (keyMap("k", event)) {
        if (dirVal > dirMin) {
            dir.val(dirVal - 1);
        }
    }else if (keyMap("m", event)) {
        if (dirVal < dirMax) {
            dir.val(dirVal + 1);
        }
    }else if (keyMap("o", event)) {
        game.unPause()
    }else if (keyMap("p", event)) {
        game.isPaused = true;
    }
}

function keyMap(letter, event){
    return letter.charCodeAt(0) == event.charCode;
}