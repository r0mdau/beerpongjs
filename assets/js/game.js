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

Game.prototype.initCamera = function () {
    camera.position.set(0, 30, 50);
    camera.lookAt(scene.position);
};

Game.prototype.checkIfBallIsInCup = function () {
    if (ball.isLaunched && ball.isStopped()) {
        this.removeCupIfBallIsInOpponent();
        this.removeCupIfBallIsInMine();
        ball.init();
        this.isPaused = true;
    }
};

Game.prototype.removeCupIfBallIsInMine = function () {
    for (var index = 0; index < scene.cupsM.length; index++) {
        var cup = scene.cupsM[index];
        if (ball.isInCup(cup) && !cup.removed) {
            cup.removed = true;
            var cupToRemove = scene.getObjectByName('mycup' + index);
            var beerToRemove = scene.getObjectByName('mybeer' + index);
            this.lastRemovedCup = cupToRemove;
            this.beerRemoved = beerToRemove;
            scene.remove(cupToRemove);
            scene.remove(beerToRemove);
            for (var i = 1; i < 9; i++) {
                var miniWall = scene.getObjectByName('my' + index + 'miniWall' + i);
                this.miniWallsRemoved.push(miniWall);
                scene.remove(miniWall);
            }
            this.init();
        }
    }
};

Game.prototype.removeCupIfBallIsInOpponent = function () {
    for (var index = 0; index < scene.cups.length; index++) {
        var cup = scene.cups[index];
        if (ball.isInCup(cup) && !cup.removed) {
            cup.removed = true;
            var cupToRemove = scene.getObjectByName('opponentcup' + index);
            var beerToRemove = scene.getObjectByName('opponentbeer' + index);
            this.lastRemovedCup = cupToRemove;
            this.beerRemoved = beerToRemove;
            scene.remove(cupToRemove);
            scene.remove(beerToRemove);
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

Game.prototype.finished = function () {
    return parseInt($("#nbcups").text()) <= 0;
};

Game.prototype.playCameraAnimation = function () {
    camera.position.set(camera.position.x + (ball.position.y / 20), camera.position.y, camera.position.z);
};

Game.prototype.unPause = function () {
    this.isPaused = false;
    scene.onSimulationResume();
};