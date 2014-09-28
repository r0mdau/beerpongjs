function doThingsWhenMyKeyIsPressed(event){
    var dir = $('#direction');
    var dirVal = parseInt($('#direction').val());
    var dirMin = parseInt(dir.attr('min'));
    var dirMax = parseInt(dir.attr('max'));
    
    if (keyMap("p", event)) {
        game.isPaused = true;
    }else if (keyMap("o", event)) {
        game.unPause()
    }else if (keyMap("i", event)) {
        game.init();
    }else if (keyMap("r", event)) {
		game.replay = true;	
    }else if (event.keyCode == 13) { // enter
		ball.launch({x: $('#direction').val(), y: 2, z: -$('#puissance').val()});
        game.unPause();		
    }else if (keyMap("k", event)) {
		if (dirVal > dirMin) {
			dir.val(dirVal - 1);
		}
    }else if (keyMap("m", event)) {
		if (dirVal < dirMax) {
			dir.val(dirVal + 1);
		}
    }else if (keyMap("a", event)) { // CHEAT POUR TESTS
		ball.launch({x: 0, y: 2, z: -32.5});		
        game.unPause();	
    }else if (keyMap("z", event)) { // CHEAT POUR TESTS
		ball.launch({x: -3.5, y: 2, z: -39});
        game.unPause();	
    }else if (keyMap("e", event)) { // CHEAT POUR TESTS
		ball.launch({x: 3.5, y: 2, z: -39});
        game.unPause();	
    }
}

function keyMap(letter, event){
    return letter.charCodeAt(0) == event.charCode;
}