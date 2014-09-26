/* Variables globales pour ce fichier */
var nombre = 20;
var augmenter = true;
/* FIN Variables globales pour ce fichier */

function initCursor() {
    var div = $('#control');
    div.css({
        "margin-left" : (window.innerWidth - div.width() - 10)+"px",
        "margin-top" : (window.innerHeight - div.height() - 10)+"px",
        "border-radius" : "10px",
        "background-color" : "#D8D8D8",
        "font-family" : "Verdana"
    });
    
    $('#launch').click(function(){
        sphere.setLinearVelocity({x: $('#direction').val(), y: 2, z: -$('#puissance').val()});
        unPause()
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