Ball.prototype = new Physijs.BoxMesh(
    new THREE.SphereGeometry(0.6, 32, 32),
    new THREE.MeshLambertMaterial({map : THREE.ImageUtils.loadTexture("assets/img/fire.png")})
);
Ball.prototype.constructor = Ball;

function Ball () {
    this.isLaunched = false;
}

Ball.prototype.init = function(){
    this.position.set(0, 15, 20);
    scene.add(this);
}

Ball.prototype.launch = function(velocity){
    this.setLinearVelocity(velocity);
    game.checkIfBallWillBeInCup(velocity);
}

Ball.prototype.isInCup = function(cup){
    return this.position.x < cup.coord.x + 2 && this.position.x > cup.coord.x - 2
        && this.position.z < cup.coord.y + 2 && this.position.z > cup.coord.y - 2;
}

Ball.prototype.isStopped = function () {
    return this.getLinearVelocity().x === 0 && this.getLinearVelocity().y === 0 && this.getLinearVelocity().z === 0;
}