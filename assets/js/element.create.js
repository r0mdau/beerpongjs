/* Variables globales pour ce fichier */
var table;
var sphere;
var loader = new THREE.ColladaLoader();
var positionCup = [{x:0,y:0},{x:-2,y:-3.5},{x:2,y:-3.5},{x:-6,y:-3.5},{x:6,y:-3.5},{x:-4,y:0},{x:4,y:0},{x:-2,y:3.5},{x:2,y:3.5},{x:0,y:7}];

var MINIWALL_SIZE = 1.4;
var TABLE_SIZE = 30;
/* FIN Variables globales pour ce fichier */

function createScene(scene){
    table = new Physijs.PlaneMesh(
        new THREE.PlaneGeometry(TABLE_SIZE, TABLE_SIZE * 2.4),
        new THREE.MeshLambertMaterial({map : THREE.ImageUtils.loadTexture("assets/img/beerpongofficial.jpg")})
    );
    table.receiveShadow = true;
    table.position.set(0, 0, -12);
    table.rotation.x = -0.5 * Math.PI;

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(0, 70, 30);
    scene.add(spotLight);

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xc0c0c0, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true; 
    
    table.add(createTrayWithCups(-30, 0));
    table.add(createTrayWithCups(30, Math.PI));
        
    sphere = new Physijs.BoxMesh(
        new THREE.SphereGeometry(0.6, 32, 32),
        new THREE.MeshLambertMaterial({map : THREE.ImageUtils.loadTexture("assets/img/fire.png")})
    );
    initSphere();
    scene.add(table);
    
    return scene;
}

function initSphere(){    
    sphere.position.set(0, 15, 20);
    scene.add(sphere);
}

function addCupsOnTray(tray){    
    for (var i = 0; i < positionCup.length; i++){
        loader.options.convertUpAxis = true;
        loader.load('assets/collada/plasticcup.dae', function(collada){                
            var cup = collada.scene;               
            cup.position.set(positionCup[i].x, positionCup[i].y, 0);
            cup.scale.set(1.5, 1.5, 1.5);
            cup.rotation.x = 0.5 * Math.PI;
            tray.add(cup);
        });
    }
}

function addMiniWallsOnTray(tray){
    for (var i = 0; i < positionCup.length; i++){
        tray.add(createAndPositionMiniWall(positionCup[i].x, positionCup[i].y + 1.7, 0.5 * Math.PI, 0));                     
        tray.add(createAndPositionMiniWall(positionCup[i].x, positionCup[i].y - 1.7, 0.5 * Math.PI, 0));            
        tray.add(createAndPositionMiniWall(positionCup[i].x + 2, positionCup[i].y, 0, 0.5 * Math.PI));            
        tray.add(createAndPositionMiniWall(positionCup[i].x - 2, positionCup[i].y, 0, 0.5 * Math.PI));
        
        tray.add(createAndPositionMiniWall(positionCup[i].x + (2/1.5), positionCup[i].y + (1.7/1.5), 0.5 * Math.PI, -0.25 * Math.PI));
        tray.add(createAndPositionMiniWall(positionCup[i].x - (2/1.5), positionCup[i].y + (1.7/1.5), 0.5 * Math.PI, 0.25 * Math.PI));            
        tray.add(createAndPositionMiniWall(positionCup[i].x + (2/1.5), positionCup[i].y - (1.7/1.5), 0.5 * Math.PI, 0.25 * Math.PI));
        tray.add(createAndPositionMiniWall(positionCup[i].x - (2/1.5), positionCup[i].y - (1.7/1.5), 0.5 * Math.PI, -0.25 * Math.PI));
    }
}

function createTrayWithCups(y, rotation){
    var tray = new Physijs.PlaneMesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshLambertMaterial({opacity:0.0, color: 'white'})
    );
    tray.position.set(0, y, 0);
    tray.rotation.z = rotation;
    
    addCupsOnTray(tray);
    addMiniWallsOnTray(tray);
    
    return tray;
}

function createAndPositionMiniWall(x, y, rotationX, rotationY){
    var height = width = MINIWALL_SIZE;
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
    miniWall.position.set(x, y, 2);
    miniWall.rotation.set(rotationX, rotationY, 0);
    return miniWall;
}