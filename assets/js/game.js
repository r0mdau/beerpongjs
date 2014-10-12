'use strict';

function Game () {
    this.isPaused = true;
    this.isReplaying = false;
    this.canReplay = false;
}

Game.prototype.init = function(){
    this.isPaused = true;
    this.isReplaying = false;
	ball.init();
};

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
                opponentTray.remove(this.lastRemovedCup);
                opponentTray.remove(this.beerRemoved);
                this.init();
                this.initCamera();
            }
        }
    }
    myScreen.randomPowerCursor();
};

Game.prototype.replay = function () {
    if (this.canReplay) {
        this.canReplay = false;
        opponentTray.add(this.lastRemovedCup);
        opponentTray.add(this.beerRemoved);
        this.isReplaying = true;
        this.unPause();
    }
};

Game.prototype.initCamera = function () {
    camera.position.set(0, 30, 50);
    camera.lookAt(scene.position);
};

Game.prototype.checkIfBallIsInCup = function () {
    if (ball.isLaunched && ball.isStopped()) {
        this.removeCupIfBallIsIn();
        ball.init();
        this.isPaused = true;
    }
};

Game.prototype.removeCupIfBallIsIn = function () {
    $.each(scene.cups, function (index, cup) {
        if (ball.isInCup(cup) && !cup.removed) {
            cup.removed = true;
            var cupToRemove = opponentTray.getObjectByName('cup' + index);
            var beerToRemove = opponentTray.getObjectByName('beer'+index);
            game.lastRemovedCup = cupToRemove;
            game.beerRemoved = beerToRemove;
            opponentTray.remove(cupToRemove);
            opponentTray.remove(beerToRemove);
            for (var i = 1; i < 9; i++) {
                //opponentTray.remove(opponentTray.getObjectByName('miniWall'+index+i));
                scene.remove(scene._objects[2].children[0].children[0]);
            }
            myScreen.updateTheCounterOfDeletedCup();
            game.canReplay = true;
            myScreen.replayMessage.show();
            game.init();
        }
    });
};

Game.prototype.playCameraAnimation1 = function () {
    camera.position.set(camera.position.x + (ball.position.y / 20), camera.position.y, camera.position.z);
    camera.lookAt(opponentTray.position);
};

Game.prototype.unPause = function(){
    this.isPaused = false;
    scene.onSimulationResume();        
};