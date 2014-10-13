'use strict';

function Game () {
    this.isPaused = true;
    this.isReplaying = false;
    this.canReplay = false;
    this.miniWallsRemoved = [];
}

Game.prototype.init = function(){
    this.isPaused = true;
    this.isReplaying = false;
	ball.init();
};

Game.prototype.play = function(){
    if(!ball.isOverTable()) {
        this.init();
    }else if(!this.isPaused){
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
                scene.remove(this.lastRemovedCup);
                scene.remove(this.beerRemoved);
                for(var i = 0; i <  this.miniWallsRemoved.length; i++){
                    scene.remove(this.miniWallsRemoved[i]);
                }
                this.init();
                this.initCamera();
            }
        }
    }else if(this.finished()){
        this.replay();
    }
    myScreen.randomPowerCursor();
};

Game.prototype.replay = function () {
    myScreen.replayMessage.hide();
    if (this.canReplay) {
        this.canReplay = false;
        scene.add(this.lastRemovedCup);
        scene.add(this.beerRemoved);
        for(var i = 0; i <  this.miniWallsRemoved.length; i++){
            scene.add(this.miniWallsRemoved[i]);
        }
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
        this.removeCupIfBallIsInOpponent();
        ball.init();
        this.isPaused = true;
    }
};

Game.prototype.removeCupIfBallIsInOpponent = function () {
    for(var index = 0; index < scene.cups.length; index++){
        var cup = scene.cups[index];
        if (ball.isInCup(cup) && !cup.removed) {
            cup.removed = true;
            var cupToRemove = scene.getObjectByName('opponentcup' + index);
            var beerToRemove = scene.getObjectByName('opponentbeer'+index);
            this.lastRemovedCup = cupToRemove;
            this.beerRemoved = beerToRemove;
            scene.remove(cupToRemove);
            scene.remove(beerToRemove);
            for (var i = 1; i < 9; i++) {
                var miniWall = scene.getObjectByName('opponent'+index+'miniWall'+i);
                this.miniWallsRemoved.push(miniWall);
                scene.remove(miniWall);
            }
            myScreen.updateTheCounterOfDeletedCup();
            this.canReplay = true;
            myScreen.replayMessage.show();
            this.init();
        }
    }
};

Game.prototype.finished = function(){
    return parseInt($("#nbcups").text()) <= 0;
};

Game.prototype.playCameraAnimation1 = function () {
    camera.position.set(camera.position.x + (ball.position.y / 20), camera.position.y, camera.position.z);
};

Game.prototype.unPause = function(){
    this.isPaused = false;
    scene.onSimulationResume();        
};