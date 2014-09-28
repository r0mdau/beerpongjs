function Game () {
    this.isPaused = true;
    this.cameraIsAnimated = false;
    this.velocitysForCups = [
                        {x : 0, z : -32.5},
                  {x : 0, z : 0},{x : 0, z : 0},
           {x : 0, z : 0},{x : 0, z : -37},{x : 0, z : 0},
    {x: 3.5, y: 2, z: -39},{x : 0, z : 0},{x : 0, z : 0},{x: -3.5, y: 2, z: -39},
    ];
}

Game.prototype.play = function(){
    if(!game.isPaused){
        if (!ball.isStopped()) {
            ball.isLaunched = true;
        }
        scene.simulate();
        this.runIfBallIsStopped();
    }
    if(this.cameraIsAnimated){
        this.playCameraAnimation1();
    }
    myScreen.randomPowerCursor();
}

Game.prototype.init = function(){
    this.isPaused = true;
    this.cameraIsAnimated = false;
    this.initCamera();
	ball.init();
}

Game.prototype.initCamera = function(){
    camera.position.set(0, 30, 50);
    camera.lookAt(scene.position);
}

Game.prototype.runIfBallIsStopped = function() {
    if (ball.isLaunched && ball.isStopped()) {
        this.removeCupIfBallIsIn();
        ball.isLaunched = false;
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

Game.prototype.velocityIsKnownAndCupIsNotRemoved = function (velocity){
    var found = false;
    for(var i = 0; i < this.velocitysForCups.length; i++){
        if(this.velocitysForCups[i].x == velocity.x && this.velocitysForCups[i].z == velocity.z && !cups[i].removed){
            found = true;
        }
    }
    return found;
}

Game.prototype.checkIfBallWillBeInCup = function(velocity){
    if(this.velocityIsKnownAndCupIsNotRemoved(velocity)){
        this.cameraIsAnimated = true;
    }
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