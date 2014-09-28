function Game () {
    this.isPaused = true;
    this.replay = false;
}

Game.prototype.init = function(){
    this.isPaused = true;
    this.replay = false;
    this.initCamera();
	ball.init();
}

Game.prototype.play = function(){
    if(!game.isPaused){
        if (!ball.isStopped()) {
            ball.isLaunched = true;
        }
        scene.simulate();
        if(!this.replay){
            this.checkIfBallIsInCup();
        }
    }
    if(this.replay){               
        if (!ball.isLaunched){
            ball.launch(ball.lastVelocity);
            this.unPause();            
        }else if (ball.isLaunched && !ball.isStopped()) {
            this.playCameraAnimation1();
        }else{
            this.init();
        }
    }
    myScreen.randomPowerCursor();
}

Game.prototype.initCamera = function(){
    camera.position.set(0, 30, 50);
    camera.lookAt(scene.position);
}

Game.prototype.checkIfBallIsInCup = function() {
    if (ball.isLaunched && ball.isStopped()) {
        this.removeCupIfBallIsIn();
        ball.init();
    }
}

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
}

Game.prototype.playCameraAnimation1 = function(){  
    camera.position.set(camera.position.x + (ball.position.y/20), camera.position.y, camera.position.z);
    camera.lookAt(tray2.position);
}

Game.prototype.unPause = function(){
    this.isPaused = false;
    scene.onSimulationResume();        
}

Game.prototype.loadCup = function(){
    var loader = new THREE.ColladaLoader();
    loader.options.convertUpAxis = true;
    loader.load('assets/collada/plasticcup.dae', function(collada){                
        cup = collada.scene;
        cup.scale.set(1.5, 1.5, 1.5);
        cup.rotation.x = 0.5 * Math.PI;
    });
}