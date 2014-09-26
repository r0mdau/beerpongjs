/* Variables globales pour ce fichier */
var table;
var ball;
var positionCup = [{x:0,y:0},{x:-2,y:-3.5},{x:2,y:-3.5},{x:-6,y:-3.5},{x:6,y:-3.5},{x:-4,y:0},{x:4,y:0},{x:-2,y:3.5},{x:2,y:3.5},{x:0,y:7}];

var MINIWALL_SIZE = 1.4;
var TABLE_SIZE = 30;
var cups = [];
var tray1, tray2;
/* FIN Variables globales pour ce fichier */

function createScene(){
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 30, 50);
    camera.lookAt(scene.position); 
    cameraControl = new THREE.OrbitControls(camera);
        
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
    
    tray1 = createTrayWithCups(-30, 0);
    tray2 = createTrayWithCups(30, Math.PI);
    table.add(tray1);
    table.add(tray2);
        
    ball = new Ball();
    ball.init();
    table.name = 'toto';
    scene.add(table);
    
    $.each(cups, function(index, value){
        cups[index].coord = {
            x : value.position.x + value.parent.position.x + value.parent.parent.position.x,
            y : value.position.y + value.parent.position.y + value.parent.parent.position.y
        };
    });
    
    return scene;
}

function addCupsOnTray(tray){
    for (var i = 0; i < positionCup.length; i++){
        var newcup = cup.clone();
        newcup.position.set(positionCup[i].x, positionCup[i].y, 0);
        newcup.name = 'cup' + i;
        cups.push(newcup);
        tray.add(newcup);
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