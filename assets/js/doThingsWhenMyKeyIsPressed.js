function doThingsWhenMyKeyIsPressed(event){
    if (keyMap("p", event)) {
        isPaused = true;
    }else if (keyMap("o", event)) {
        unPause()
    }else if (keyMap("i", event)) {
        isPaused = true;
		initSphere();
    }
}

function keyMap(letter, event){
    return letter.charCodeAt(0) == event.keyCode;
}