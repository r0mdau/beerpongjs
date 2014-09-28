function Game () {
    this.isPaused = true;
}

Game.prototype.play = function(){
    if(!game.isPaused){
        if (!ball.isStopped()) {
            ball.isLaunched = true;
        }
        scene.simulate();
        this.runIfBallIsStopped();
    }
    myScreen.randomPowerCursor();
};

Game.prototype.init = function(){
    this.isPaused = true;
	ball.init();
};

Game.prototype.runIfBallIsStopped = function() {
    if (ball.isLaunched && ball.isStopped()) {
        this.removeCupIfBallIsIn();
        ball.isLaunched = false;
    }
};

Game.prototype.removeCupIfBallIsIn = function() {
    $.each(cups, function(index, cup){
        if (ball.isInCup(cup) && !cup.removed) {
            cup.removed = true;
            tray2.remove(tray2.getObjectByName('cup'+index));
            for(var i = 1; i < 9; i++){
                tray2.remove(tray2.getObjectByName('miniWall'+index+i));
            }
            game.init();
        }
    });
};

Game.prototype.unPause = function(){
    this.isPaused = false;
    scene.onSimulationResume();        
};

Game.prototype.loadCup = function(){
    var loader = new THREE.ColladaLoader();
    loader.options.convertUpAxis = true;
    loader.load('assets/collada/plasticcup.dae', function(collada){                
        cup = collada.scene;
        cup.scale.set(1.5, 1.5, 1.5);
        cup.rotation.x = 0.5 * Math.PI;
    });
};