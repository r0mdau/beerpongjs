'use strict';

Ball.prototype = new Physijs.BoxMesh(
    new THREE.SphereGeometry(0.6, 32, 32),
    new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture("assets/img/fire.png")})
);
Ball.prototype.constructor = Ball;

function Ball() {
    this.isLaunched = false;
}

Ball.prototype.init = function () {
    this.position.set(0, 15, 20);
    this.isLaunched = false;
    scene.add(this);
};

Ball.prototype.initWithPos = function(vector){
    this.position.set(vector.x, vector.y, vector.z);
    this.isLaunched = false;
    scene.add(this);
};

Ball.prototype.launch = function(velocity){
    this.lastVelocity = velocity;
    this.setLinearVelocity(velocity);
};

Ball.prototype.isInCup = function (cup) {
    return this.position.x < cup.x + 1.5 && this.position.x > cup.x - 1.5
    && this.position.z < cup.z + 1.5 && this.position.z > cup.z - 1.5
    && this.position.y < 3;
};

Ball.prototype.isOverTable = function () {
    return this.position.x > scene.table.position.x - (scene.table.geometry.parameters.width / 2) - 5
    && this.position.x < scene.table.position.x + (scene.table.geometry.parameters.width / 2) + 5
    && this.position.z > scene.table.position.z - (scene.table.geometry.parameters.height / 2) - 5
    && this.position.z < scene.table.position.z + (scene.table.geometry.parameters.height / 2) + 5;
};

Ball.prototype.isStopped = function () {
    return this.getLinearVelocity().x === 0 && this.getLinearVelocity().y === 0 && this.getLinearVelocity().z === 0;
};