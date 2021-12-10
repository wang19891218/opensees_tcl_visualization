import * as THREE from 'three/build/three.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Lut } from 'three/examples/jsm/math/Lut'

import { formatInt, formatFloat } from './utils';
// import { list } from 'postcss';


var scaleDisplay = 0.01;
var gridHelperSize = 1;
var gridHelperSizeDivisions = 10;

// Global variables
const raycaster = new THREE.Raycaster();
var vect2PointerCoord = new THREE.Vector2(0, 0);
var mousePressed = false;
// var intersectedObjectColor;

let camera, canvas, scene, renderer, controls;
let divText;
let gridHelper;
let INTERSECTED;

let hemiLight; 
let listMeshNode;
var nodeColor = "#ff0000";

var listMeshArrowHelper = [];
var arrowHelperLength = 0.1;

export var meshWarehouse;

const lut = new Lut( 'rainbow', 512 );
lut.setMin(0)
lut.setMax(1)

function colorMap(floatValue) {
    return lut.getColor(floatValue)
}

function onWindowResize() {
    let canvas = document.getElementById("buildingVisualization");
    let width = canvas.parentElement.innerWidth;
    let height = canvas.parentElement.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

function onMouseDown(event) { mousePressed = true; }

function onMouseUp(event) { mousePressed = false; }

function onPointerMove(event) {
    let canvasBounds = renderer.getContext().canvas.getBoundingClientRect();
    vect2PointerCoord.x = ( 
        ( event.clientX - canvasBounds.left ) 
        / ( canvasBounds.right - canvasBounds.left ) ) * 2 - 1;
    vect2PointerCoord.y = - ( 
        ( event.clientY - canvasBounds.top ) 
        / ( canvasBounds.bottom - canvasBounds.top) ) * 2 + 1;
    divText.style.left = event.clientX + 15 + "px";
    divText.style.top = event.clientY - 5 +  "px"; 
}

function getAngle(vect3From, vect3To) {
    // caution: only works with vectors on xy, yz, and zx plan
    var radian = Math.acos(vect3From.clone().dot(vect3To));
    var normal = vect3From.clone().cross(vect3To);
    if (normal.x + normal.y + normal.z > 0.0) {
        radian = -radian;
    }
    return radian;
}

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

    camera = new THREE.PerspectiveCamera(
        45, window.innerWidth / window.innerHeight, 0.001, 100);
    camera.position.set(0.0, 1.0, 1.0)
    // scene.add(camera);

    canvas = document.getElementById('buildingVisualization')
    let width = canvas.parentElement.clientWidth;
    let height = canvas.parentElement.clientHeight;
    // canvas.style.maxWidth = "800px";
    renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });
    renderer.setSize(width, height);

    hemiLight = new THREE.HemisphereLight(0xffffff, 0x080820, 0.8);
    hemiLight.position.set(0, 200, 20);
    scene.add(hemiLight);

    gridHelper = new THREE.GridHelper(gridHelperSize, gridHelperSizeDivisions);
    scene.add(gridHelper);

    // controls = new OrbitControls(camera, canvas);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enableZoom = true;
    controls.update();
    // renderer.render(scene, camera);
}


function initializeText() {
    divText = document.createElement("div");
    document.body.appendChild(divText);
    divText.style.position = "absolute";
    divText.style.top = "0px";
    divText.style.left = "0px";
    divText.style.width = "60px";
    divText.style.height = "20px";
    divText.style.borderRadius = "1px";
    divText.style.borderWidth = "1px";
    divText.style.borderStyle = "solid";
    divText.style.backgroundColor = "white";
    divText.style.opacity = "0.9";
    divText.innerText = "Hello World"
    divText.zIndex = "1000"; 
    divText.style.fontSize = "12px";
    divText.style.display = "none"; 
    divText.style.textAlign = "center";
}

function updateText(){
    if (INTERSECTED) {
        divText.innerText = INTERSECTED.displayInfo;
        divText.style.display = "block"; 
    }
    else {
        divText.style.display = "none"; 
    }

}

export function initializeNodeMesh(dictNodeInfo){
    var listKeys = Object.keys(dictNodeInfo);
    listMeshNode = []
    var vect3MeanPosition = new THREE.Vector3();
    for (var iNode = 0; iNode < listKeys.length; iNode++) {
        let key = listKeys[iNode];
        let listNodeCoord = dictNodeInfo[key]["coordinate"]
        var geometrySphere= new THREE.SphereGeometry(0.1 * scaleDisplay,10 ,10 );
        geometrySphere.center();

        var materialSphere = new THREE.MeshBasicMaterial({ 
            color: nodeColor,
            opacity: 0.5,});
           

        var meshSphere = new THREE.Mesh(geometrySphere, materialSphere);
        meshSphere.position.x = listNodeCoord[0] * scaleDisplay;
        meshSphere.position.y = listNodeCoord[2] * scaleDisplay;
        meshSphere.position.z = listNodeCoord[1] * scaleDisplay;

        meshSphere.name = "node number: " + formatInt(key)
            + " Coord: " + formatFloat(listNodeCoord[0]) 
            + ", " + formatFloat(listNodeCoord[1]) 
            + ", " + formatFloat(listNodeCoord[2]);

        meshSphere.targetColor = nodeColor;
        meshSphere.displayInfo = "node number: " + formatInt(key)

        listMeshNode.push(meshSphere)
        scene.add(meshSphere);
        // # Calculate center 
        vect3MeanPosition.x += meshSphere.position.x / listKeys.length;
        vect3MeanPosition.y += meshSphere.position.y / listKeys.length;
        vect3MeanPosition.z += meshSphere.position.z / listKeys.length;
    }
    controls.target.set(
        vect3MeanPosition.x, 
        vect3MeanPosition.y, 
        vect3MeanPosition.z);
    camera.position.set(
        vect3MeanPosition.x * 3, 
        vect3MeanPosition.y * 3, 
        vect3MeanPosition.z * 3);

    arrowHelperLength = Math.hypot(...vect3MeanPosition.toArray()) * 2;
    console.log("arrowHelperLength: " + arrowHelperLength);
    listMeshArrowHelper[0].scale.set(arrowHelperLength, 1, 1)
    listMeshArrowHelper[1].scale.set(1, arrowHelperLength, 1)
    listMeshArrowHelper[2].scale.set(1, 1, arrowHelperLength)
    console.log(listMeshArrowHelper[2])
}


function initiateXYZHelper() {
    // X, Y, Z axis arrows
    let length = 1 

    let origin = new THREE.Vector3(0, 0, 0);
    var hexColorX = 0xff0000;
    var hexColorY = 0x00ff00;
    var hexColorZ = 0x0000ff;
    var vect3DirX = new THREE.Vector3(1, 0, 0);
    var vect3DirY = new THREE.Vector3(0, 1, 0);
    var vect3DirZ = new THREE.Vector3(0, 0, 1);

    var arrowHelperX = new THREE.ArrowHelper(
        vect3DirX, origin, length, hexColorX, 0.003, 0.003);
    scene.add(arrowHelperX);
    var arrowHelperY = new THREE.ArrowHelper(
        vect3DirY, origin, length, hexColorY, 0.003, 0.003);
    scene.add(arrowHelperY);
    var arrowHelperZ = new THREE.ArrowHelper(
        vect3DirZ, origin, length, hexColorZ, 0.003, 0.003);
    scene.add(arrowHelperZ);
    console.log(arrowHelperZ)
    listMeshArrowHelper.push(arrowHelperX)
    listMeshArrowHelper.push(arrowHelperX)
    listMeshArrowHelper.push(arrowHelperX)
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render()
};


function functionResetColor(valueColor){
    listMeshNode.forEach(function(MeshNode){
        MeshNode.material.color.set(valueColor);
    })
}

export function functionSetNodeScale(valueScale){
    if (listMeshNode){
        listMeshNode.forEach(function(MeshNode){
            MeshNode.scale.set(valueScale, valueScale, valueScale);
        })
    }
}


export function functionSetNodeColor(valueColor){
    nodeColor = valueColor;
}

function render() {
    // Change color of hover object and show its name (sensor index)
    raycaster.setFromCamera(vect2PointerCoord, camera);
    if (listMeshNode ){
        const intersects = raycaster.intersectObjects(listMeshNode, false);
        if ( intersects.length > 0 ) {
            if ( INTERSECTED != intersects[ 0 ].object ) {
                INTERSECTED = intersects[ 0 ].object;
                intersectedObjectColor = INTERSECTED.material.color.getHex();
                INTERSECTED.material.color.setHex( 0xffffff );
            }
        } else {
            // let valueColor = document.getdomElementById("controlPanel").value;
            functionResetColor(nodeColor);
            INTERSECTED = null;
        }
    }
    updateText();
    renderer.render(scene, camera);
};

window.addEventListener('resize', onWindowResize, false);
window.addEventListener('pointermove', onPointerMove, false);
window.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('mouseup', onMouseUp, false);

init();
initializeText()// initializeText();
initiateXYZHelper();
animate();