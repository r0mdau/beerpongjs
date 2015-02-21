'use strict';

function Game() {
    this.isPaused = true;
}

Game.prototype.init = function () {
    this.isPaused = true;
	ball.init();
};

Game.prototype.play = function () {
    if(canPlay && !this.isPaused){
        if (!ball.isStopped()) {
            ball.isLaunched = true;
        }
        if (!ball.isOverTable()) {
            this.init();
            socket.emit('hasPlayed');
        }else if (ball.isLaunched && ball.isStopped()) {
            this.checkIfBallIsInCup();
        }
    }
    if(!this.isPaused){
        scene.simulate();
    }
    myScreen.randomPowerCursor();
};

Game.prototype.checkIfBallIsInCup = function () {
    this.removeCupIfBallIsInOpponent();
    this.init();
    this.isPaused = true;
    socket.emit('hasPlayed');
};

Game.prototype.removeMyCup = function (index) {
    var cup = scene.cupsM[index];
    cup.removed = true;
    var cupToRemove = scene.getObjectByName('mycup' + index);
    var beerToRemove = scene.getObjectByName('mybeer' + index);
    scene.remove(cupToRemove);
    scene.remove(beerToRemove);
    for (var i = 1; i < 9; i++) {
        var miniWall = scene.getObjectByName('my' + index + 'miniWall' + i);
        scene.remove(miniWall);
    }
};

Game.prototype.removeCupIfBallIsInOpponent = function () {
    for (var index = 0; index < scene.cups.length; index++) {
        var cup = scene.cups[index];
        if (ball.isInCup(cup) && !cup.removed) {
            cup.removed = true;
            var cupToRemove = scene.getObjectByName('opponentcup' + index);
            var beerToRemove = scene.getObjectByName('opponentbeer' + index);
            scene.remove(cupToRemove);
            scene.remove(beerToRemove);
            socket.emit('removeCup', index);
            for (var i = 1; i < 9; i++) {
                var miniWall = scene.getObjectByName('opponent' + index + 'miniWall' + i);
                scene.remove(miniWall);
            }
            myScreen.updateTheCounterOfDeletedCup();
        }
    }
};

Game.prototype.unPause = function () {
    this.isPaused = false;
    scene.onSimulationResume();
};