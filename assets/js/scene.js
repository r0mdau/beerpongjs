'use strict';

var MINIWALL_SIZE = 1.4;
var TABLE_SIZE = 30;

Physijs.scripts.worker = 'libs/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

Scene.prototype = new Physijs.Scene;
Scene.prototype.constructor = Scene;

function Scene () {
    this.cups = [];
    this.miniWallIndex = 1;
    this.beerIndex = 1;
    this.matriceOfCups = [
                            {x:0,y:7},
                    {x:-2,y:3.5},{x:2,y:3.5},
                  {x:-4,y:0},{x:0,y:0},{x:4,y:0},
    {x:-6,y:-3.5}, {x:-2,y:-3.5}, {x:2,y:-3.5}, {x:6,y:-3.5}
    ];
}

Scene.prototype.create = function(){
    this.loadCup();
    
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 30, 50);
    camera.lookAt(scene.position); 
    cameraControl = new THREE.OrbitControls(camera);
        
    this.table = new Physijs.PlaneMesh(
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
    
    myTray = this.createTrayWithCups(-30, 0);
    opponentTray = this.createTrayWithCups(30, Math.PI);
    this.table.add(myTray);
    this.table.add(opponentTray);
        
    ball = new Ball();
    ball.init();
    scene.add(this.table);
    
    for(var index = 0; index < this.cups.length; index++){
        var value = this.cups[index];
        this.cups[index].coord = {
            x : -(value.position.x + value.parent.position.x + value.parent.parent.position.x),
            y : value.position.y + value.parent.position.y + value.parent.parent.position.z,
            z : value.position.z + value.parent.position.z + value.parent.parent.position.y
        };
        this.cups[index].removed = false;
    }
};

Scene.prototype.addCupsOnTray = function(tray){
    for (var i = 0; i < this.matriceOfCups.length; i++){
        var newcup = cup.clone();
        newcup.position.set(this.matriceOfCups[i].x, this.matriceOfCups[i].y, 0);
        newcup.name = 'cup' + i;
        this.cups.push(newcup);
        tray.add(newcup);
    }
};

Scene.prototype.addMiniWallsOnTray = function(tray){
    for (var i = 0; i < this.matriceOfCups.length; i++){
        tray.add(this.createAndPositionMiniWall(this.matriceOfCups[i].x, this.matriceOfCups[i].y + 1.7, 0.5 * Math.PI, 0, i));                     
        tray.add(this.createAndPositionMiniWall(this.matriceOfCups[i].x, this.matriceOfCups[i].y - 1.7, 0.5 * Math.PI, 0, i));            
        tray.add(this.createAndPositionMiniWall(this.matriceOfCups[i].x + 2, this.matriceOfCups[i].y, 0, 0.5 * Math.PI, i));            
        tray.add(this.createAndPositionMiniWall(this.matriceOfCups[i].x - 2, this.matriceOfCups[i].y, 0, 0.5 * Math.PI, i));
        
        tray.add(this.createAndPositionMiniWall(this.matriceOfCups[i].x + (2/1.5), this.matriceOfCups[i].y + (1.7/1.5), 0.5 * Math.PI, -0.25 * Math.PI, i));
        tray.add(this.createAndPositionMiniWall(this.matriceOfCups[i].x - (2/1.5), this.matriceOfCups[i].y + (1.7/1.5), 0.5 * Math.PI, 0.25 * Math.PI, i));            
        tray.add(this.createAndPositionMiniWall(this.matriceOfCups[i].x + (2/1.5), this.matriceOfCups[i].y - (1.7/1.5), 0.5 * Math.PI, 0.25 * Math.PI, i));
        tray.add(this.createAndPositionMiniWall(this.matriceOfCups[i].x - (2/1.5), this.matriceOfCups[i].y - (1.7/1.5), 0.5 * Math.PI, -0.25 * Math.PI, i));
    
        tray.add(this.createBeerInTheCup(this.matriceOfCups[i].x, this.matriceOfCups[i].y, 0.5 * Math.PI, 0, i));                     

    }
};

Scene.prototype.createTrayWithCups = function(y, rotation){
    var tray = new Physijs.PlaneMesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshLambertMaterial({opacity:0.0, color: 'white'})
    );
    tray.position.set(0, y, 0);
    tray.rotation.z = rotation;
    
    this.addCupsOnTray(tray);
    this.addMiniWallsOnTray(tray);

    return tray;
};

Scene.prototype.createAndPositionMiniWall = function(x, y, rotationX, rotationY, indice){
    var height = MINIWALL_SIZE;
    var width = MINIWALL_SIZE;
    if(rotationX == 0){
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
    miniWall.name = 'miniWall' + indice + this.miniWallIndex;
    miniWall.position.set(x, y, 2);
    miniWall.rotation.set(rotationX, rotationY, 0);
    
    if(this.miniWallIndex == 8) this.miniWallIndex = 0;
    this.miniWallIndex ++;
    
    return miniWall;
};

Scene.prototype.createBeerInTheCup = function(x, y, rotationX, rotationY, indice){
    var beer = new Physijs.CylinderMesh(
        new THREE.CylinderGeometry(1.5, 1.5, 1, 10),
        new THREE.MeshBasicMaterial({
            map : THREE.ImageUtils.loadTexture("assets/img/beer.jpeg")
        })
    );
    beer.name = 'beer' + indice;
    beer.position.set(x,y,2);
    beer.rotation.set(Math.PI/2,0,0);    
    return beer;
};

Scene.prototype.loadCup = function(){
    var loader = new THREE.ColladaLoader();
    loader.options.convertUpAxis = true;
    loader.load('assets/collada/plasticcup.dae', function(collada){                
        cup = collada.scene;
        cup.scale.set(1.5, 1.5, 1.5);
        cup.rotation.x = 0.5 * Math.PI;
    });
};