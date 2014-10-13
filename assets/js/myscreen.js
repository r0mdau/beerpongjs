'use strict';

function MyScreen () {
    this.powerCursorVal = 20;
    this.toIncrease = true;
    this.div = $('#control');
    this.replayMessage = $('#replay');
}

MyScreen.prototype.addStatsObject = function() {
    this.stats = new Stats();
    this.stats.setMode(0);
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.left = '0px';
    this.stats.domElement.style.top = '0px';

    $('body').append(this.stats.domElement);
};

MyScreen.prototype.updateStats = function() {
    this.stats.update();
};

MyScreen.prototype.initGameMenu = function() {
    
    $('#commande').css({
        "right" : (window.innerWidth - this.div.width() - 50)+"px",
        "bottom" : (window.innerHeight - this.div.height() - 150)+"px",
        "font-family" : "Ubuntu"
    });

    $("#score").css({
        "left" : (window.innerWidth - this.div.width() - 50)+"px",
        "bottom" : (window.innerHeight - this.div.height() + 30)+"px",
        "font-family" : "Ubuntu"
    });

    $("#control").css({
        "left" : (window.innerWidth - this.div.width() - 50)+"px",
        "top" : (window.innerHeight - this.div.height() - 30)+"px",
        "font-family" : "Ubuntu"
    });
};

MyScreen.prototype.randomPowerCursor = function (){
    $('#puissance').val(this.powerCursorVal);
    if (this.toIncrease) {
        this.powerCursorVal++;
    }else{
        this.powerCursorVal--;
    }
    
    if (this.powerCursorVal > 49) {
        this.toIncrease = false;
    }else if(this.powerCursorVal < 21){
        this.toIncrease = true;
    }
};

MyScreen.prototype.updateTheCounterOfDeletedCup = function (){
    $("#nbcups").text($("#nbcups").text() - 1);
};