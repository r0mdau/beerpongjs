function Game () {
    this.isPaused = true;
    this.isReplaying = false;
}

Game.prototype.init = function(){
    this.isPaused = true;
    this.isReplaying = false;
	ball.init();
}

Game.prototype.play = function(){
    if(!game.isPaused){
        if (!ball.isStopped()) {
            ball.isLaunched = true;
        }
        scene.simulate();
        
        if(!this.isReplaying){
            this.checkIfBallIsInCup();
        }else{               
            if(!ball.isLaunched){
                ball.launch(ball.lastVelocity);           
            }else if(ball.isLaunched && !ball.isStopped()) {
                this.playCameraAnimation1();
            }else{
                this.init();
                this.initCamera();
            }
        }
    }
    myScreen.randomPowerCursor();
}

Game.prototype.replay = function(){
    this.isReplaying = true;
    this.unPause();    
}

Game.prototype.initCamera = function(){
    camera.position.set(0, 30, 50);
    camera.lookAt(scene.position);
}

Game.prototype.checkIfBallIsInCup = function() {
    if (ball.isLaunched && ball.isStopped()) {
        this.removeCupIfBallIsIn();
        ball.init();
        this.isPaused = true;
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