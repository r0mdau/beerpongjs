'use strict';

function playWhenMyKeyIsPressed(event) {
    if (event.keyCode == 13) { // enter
        var velocity = {x: $('#direction').val(), y: 2, z: -$('#puissance').val()};
        $('#yourTurnMessage').hide();
        game.launchBall(velocity);
    }
}

function doThingsWhenMyKeyIsPressed(event) {
    var dir = $('#direction');
    var dirVal = parseInt(dir.val());
    var dirMin = parseInt(dir.attr('min'));
    var dirMax = parseInt(dir.attr('max'));

    if (keyMap("k", event)) {
        if (dirVal > dirMin) {
            dir.val(dirVal - 1);
        }
    } else if (keyMap("m", event)) {
        if (dirVal < dirMax) {
            dir.val(dirVal + 1);
        }
    } else if (keyMap("c", event)) {
        window.open('/chat', 'beerpongjs chat', 'menubar=no, scrollbars=no, top=100, left=100, width=500, height=300');
    }
}

function keyMap(letter, event) {
    return letter.charCodeAt(0) == event.charCode;
}