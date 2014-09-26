function MyScreen () {
    this.puissanceVal = 20;
    this.toIncrease = true;
}

MyScreen.prototype.addStatsObject = function() {
    this.stats = new Stats();
    this.stats.setMode(0);
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.left = '0px';
    this.stats.domElement.style.top = '0px';

    document.body.appendChild(this.stats.domElement);
}

MyScreen.prototype.updateStats = function() {
    this.stats.update();
}

MyScreen.prototype.initGameMenu = function() {
    var div = $('#control');
    div.css({
        "left" : (window.innerWidth - div.width() - 50)+"px",
        "top" : (window.innerHeight - div.height() - 50)+"px",
        "border-radius" : "10px",
        "border" : "1px solid black",
        "font-family" : "Helvetica"
    });
}

MyScreen.prototype.randomPowerCursor = function (){
    $('#puissance').val(this.puissanceVal);
    if (this.toIncrease) {
        this.puissanceVal++;
    }else{
        this.puissanceVal--;
    }
    
    if (this.puissanceVal > 49) {
        this.toIncrease = false;
    }else if(this.puissanceVal < 21){
        this.toIncrease = true;
    }
}