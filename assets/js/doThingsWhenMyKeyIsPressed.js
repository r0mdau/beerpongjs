function doThingsWhenMyKeyIsPressed(event){
    var dir = $('#direction');
    var dirVal = parseInt($('#direction').val());
    var dirMin = parseInt(dir.attr('min'));
    var dirMax = parseInt(dir.attr('max'));
    
    if (keyMap("p", event)) {
        isPaused = true;
    }else if (keyMap("o", event)) {
        unPause()
    }else if (keyMap("i", event)) {
        isPaused = true;
	initSphere();
    }else if (event.keyCode == 13) { // enter
	sphere.setLinearVelocity({x: $('#direction').val(), y: 2, z: -$('#puissance').val()});
        unPause();
    }else if (keyMap("k", event)) {
	if (dirVal > dirMin) {
	    dir.val(dirVal - 1);
	}
    }else if (keyMap("m", event)) {
	if (dirVal < dirMax) {
	    dir.val(dirVal + 1);
	}
    }
}

function keyMap(letter, event){
    return letter.charCodeAt(0) == event.charCode;
}