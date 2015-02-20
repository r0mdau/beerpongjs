'use strict';

function Game() {
    this.isPaused = true;
    this.miniWallsRemoved = [];
}

Game.prototype.init = function () {
    this.isPaused = true;
	ball.init();
    if (canPlay) {
        $('#message').show();
    }
};

Game.prototype.play = function () {
    if (!ball.isOverTable()) {
        this.init();
    } else if (!this.isPaused) {
        if (!ball.isStopped()) {
            ball.isLaunched = true;
        }
        scene.simulate();

        if (!ball.isLaunched) {
            ball.launch(ball.lastVelocity);
        }else if(ball.isLaunched && ball.isStopped()){
            this.checkIfBallIsInCup();
        }
    }
    myScreen.randomPowerCursor();
};

Game.prototype.checkIfBallIsInCup = function () {
    if (ball.isLaunched && ball.isStopped()) {
        this.removeCupIfBallIsInOpponent();
        ball.init();
        this.isPaused = true;
    }
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
        this.miniWallsRemoved.push(miniWall);
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
                this.miniWallsRemoved.push(miniWall);
                scene.remove(miniWall);
            }
            myScreen.updateTheCounterOfDeletedCup();
            this.init();
        }
    }
};

Game.prototype.unPause = function () {
    this.isPaused = false;
    scene.onSimulationResume();
};