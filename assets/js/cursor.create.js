/* Variables globales pour ce fichier */
var nombre = 20;
var augmenter = true;
/* FIN Variables globales pour ce fichier */

function initCursor() {
    var div = $('#control');
    div.css({
        "left" : (window.innerWidth - div.width() - 50)+"px",
        "top" : (window.innerHeight - div.height() - 50)+"px",
        "border-radius" : "10px",
        "border" : "1px solid black",
        "font-family" : "Helvetica"
    });
}

function randomPowerCursor(){
    $('#puissance').val(nombre);
    if (augmenter) {
        nombre++;
    }else{
        nombre--;
    }
    
    if (nombre > 49) {
        augmenter = false;
    }else if(nombre < 21){
        augmenter = true;
    }
}