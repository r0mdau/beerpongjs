'use strict';

var MINIWALL_SIZE = 1.4;
var TABLE_SIZE = 30;

Physijs.scripts.worker = 'libs/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

Scene.prototype = new Physijs.Scene;
Scene.prototype.constructor = Scene;

function Scene () {
    this.miniWallIndex = 1;
    this.cups = [];

    this.opponentSetOfCups = [
        {x:0,z:7-42},
        {x:-2,z:3.5-42},{x:2,z:3.5-42},
        {x:-4,z:0-42},{x:0,z:0-42},{x:4,z:0-42},
        {x:-6,z:-3.5-42}, {x:-2,z:-3.5-42}, {x:2,z:-3.5-42}, {x:6,z:-3.5-42}
    ];
    this.mySetOfCups = [
        {x:0,z:7+4},
        {x:-2,z:14.5},{x:2,z:14.5},
        {x:-4,z:18},{x:0,z:18},{x:4,z:18},
        {x:-6,z:-3.5+25}, {x:-2,z:-3.5+25}, {x:2,z:-3.5+25}, {x:6,z:-3.5+25}
    ];
}

Scene.prototype.create = function(){
    this.loadCup();
    
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 30, 50);
    camera.lookAt(scene.position); 
    cameraControl = new THREE.OrbitControls(camera);
        
    this.table = new Physijs.BoxMesh(
        new THREE.PlaneGeometry(TABLE_SIZE, TABLE_SIZE * 2.4),
        new THREE.MeshLambertMaterial({map : THREE.ImageUtils.loadTexture("assets/img/beerpongofficial.jpg")})
    );
    this.table.receiveShadow = true;
    this.table.position.set(0, 0, -12);
    this.table.rotation.x = -0.5 * Math.PI;

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(0, 70, 30);
    scene.add(spotLight);

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xc0c0c0, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;

    this.addSetOfCups(this.mySetOfCups, 'my');
    this.addSetOfCups(this.opponentSetOfCups, 'opponent');

    ball = new Ball();
    ball.init();
    scene.add(this.table);
};

Scene.prototype.addSetOfCups = function(matrix, playerName){
    for (var i = 0; i < matrix.length; i++) {
        var newcup = cup.clone();
        newcup.position.set(matrix[i].x, 0, matrix[i].z);
        newcup.name = playerName + 'cup' + i;
        if (playerName == 'opponent'){
            this.cups.push({
                playerName: playerName,
                x: newcup.position.x,
                y: newcup.position.y,
                z: newcup.position.z,
                name: newcup.name,
                removed: false
            });
        }
        this.add(newcup);

        var beer = new Physijs.CylinderMesh(
            new THREE.CylinderGeometry(1.6, 1.4, 2, 10),
            new THREE.MeshBasicMaterial({
                map : THREE.ImageUtils.loadTexture("assets/img/beer.jpeg")
            })
        );
        beer.name = playerName + 'beer' + i;
        beer.position.set(matrix[i].x, 1.1, matrix[i].z);
        this.add(beer);

        this.addMiniWallsAroundCup(i, matrix, playerName);
    }
};

Scene.prototype.addMiniWallsAroundCup = function(i, matrix, playerName){
    this.add(this.createAndPositionMiniWall(matrix[i].x, matrix[i].z + 1.7, {x:0, y:0, z:0.5 * Math.PI}, i, playerName));
    this.add(this.createAndPositionMiniWall(matrix[i].x, matrix[i].z - 1.7, {x:0,y:0,z:0.5 * Math.PI}, i, playerName));
    this.add(this.createAndPositionMiniWall(matrix[i].x + 1.9, matrix[i].z, {x:0,y:0.5*Math.PI,z:0.5*Math.PI}, i, playerName));
    this.add(this.createAndPositionMiniWall(matrix[i].x - 1.9, matrix[i].z, {x:0,y:0.5*Math.PI,z:0.5 * Math.PI}, i, playerName));

    this.add(this.createAndPositionMiniWall(matrix[i].x + (2/1.5), matrix[i].z + (1.7/1.5), {x:0,y:0.25 * Math.PI,z:0.5 * Math.PI}, i, playerName));
    this.add(this.createAndPositionMiniWall(matrix[i].x - (2/1.5), matrix[i].z + (1.7/1.5), {x:0,y:0.75 * Math.PI,z:0.5 * Math.PI}, i, playerName));
    this.add(this.createAndPositionMiniWall(matrix[i].x + (2/1.5), matrix[i].z - (1.7/1.5), {x:0,y:0.75 * Math.PI,z:0.5 * Math.PI}, i, playerName));
    this.add(this.createAndPositionMiniWall(matrix[i].x - (2/1.5), matrix[i].z - (1.7/1.5), {x:0,y:0.25 * Math.PI,z:0.5 * Math.PI}, i, playerName));
};


Scene.prototype.createAndPositionMiniWall = function(x, z, rotation, indice, playerName){
    var height = MINIWALL_SIZE;
    var width = MINIWALL_SIZE;
    if(rotation.x == 0){
        height *= 2.5;
    }else{
        width *= 2.5;
    }
    
    var miniWall = new Physijs.BoxMesh(
        new THREE.PlaneGeometry(height, width),
        new THREE.MeshBasicMaterial({
            map : THREE.ImageUtils.loadTexture("assets/img/transparent.png"),
            transparent : true
        })
    );
    miniWall.name = playerName + indice + 'miniWall' + this.miniWallIndex;
    miniWall.position.set(x, 2, z);
    miniWall.rotation.set(rotation.x, rotation.y, rotation.z);
    
    if(this.miniWallIndex == 8) this.miniWallIndex = 0;
    this.miniWallIndex ++;
    
    return miniWall;
};

Scene.prototype.loadCup = function(){
    var loader = new THREE.ColladaLoader();
    loader.options.convertUpAxis = true;
    loader.load('assets/collada/plasticcup.dae', function(collada){                
        cup = collada.scene;
        cup.scale.set(1.5, 1.5, 1.5);
    });
};