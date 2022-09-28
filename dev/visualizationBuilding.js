import * as THREE from 'three/build/three.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ConvexGeometry} from 'three/examples/jsm/geometries/ConvexGeometry';
import { Lut } from 'three/examples/jsm/math/Lut'

import { formatInt, formatFloat } from './utils';

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
var listMeshNode = [];
var nodeColor = "#ffffff";
var listMeshBeam = [];
var beamColor = "#ffffff";
var listMeshShell= [];
var shellColor = "#ffffff";
var boolShellDisplay = true;  

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
    let width = canvas.parentElement.clientWidth;
    let height = canvas.parentElement.clientHeight;
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
    divText.style.width = "80px";
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
    // clear existing mesh 
    while (listMeshNode.length > 0){
        scene.remove(listMeshNode.pop());
    }
    var vect3MeanPosition = new THREE.Vector3();
    for (var iNode = 0; iNode < listKeys.length; iNode++) {
        let key = listKeys[iNode];
        let listNodeCoord = dictNodeInfo[key]["coordinate"]
        let nodeMass = dictNodeInfo[key]["mass"]
        var geometrySphere 
            = new THREE.SphereGeometry(0.1 * scaleDisplay * 0.4,10 ,10);
        geometrySphere.center();

        var materialSphere = new THREE.MeshBasicMaterial({ 
            color: nodeColor,
            transparent: true,
            opacity: 0.7,});
           

        var meshSphere = new THREE.Mesh(geometrySphere, materialSphere);
        meshSphere.position.x = listNodeCoord[0] * scaleDisplay;
        meshSphere.position.y = listNodeCoord[1] * scaleDisplay;
        meshSphere.position.z = listNodeCoord[2] * scaleDisplay;

        meshSphere.name = "node number: " + formatInt(key)
            + " Coord: " + formatFloat(listNodeCoord[0]) 
            + ", " + formatFloat(listNodeCoord[1])
            + ", " + formatFloat(listNodeCoord[2]);

        meshSphere.targetColor = nodeColor;
        meshSphere.displayInfo = "node number: " + formatInt(key)
        meshSphere.displayInfo = meshSphere.name

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


export function initializeBeamMesh(dictElementInfo, dictNodeInfo){
    var listKeys = Object.keys(dictElementInfo);
    // clear existing mesh 
    while (listMeshBeam.length > 0){
        scene.remove(listMeshBeam.pop());
    }
    for (var iBeam = 0; iBeam < listKeys.length; iBeam++) {
        let key = listKeys[iBeam];
        let node_number_1 = dictElementInfo[key]["listNodeNumber"][0]
        let node_number_2 = dictElementInfo[key]["listNodeNumber"][1]

        let vect3NodeCoord1 = new THREE.Vector3(
            dictNodeInfo[node_number_1]["coordinate"][0],
            dictNodeInfo[node_number_1]["coordinate"][1],
            dictNodeInfo[node_number_1]["coordinate"][2])
        let vect3NodeCoord2 = new THREE.Vector3(
            dictNodeInfo[node_number_2]["coordinate"][0],
            dictNodeInfo[node_number_2]["coordinate"][1],
            dictNodeInfo[node_number_2]["coordinate"][2])
        let vect3NodeCoordMean = new THREE.Vector3(
            (vect3NodeCoord1.x + vect3NodeCoord2.x)/ 2,
            (vect3NodeCoord1.y + vect3NodeCoord2.y)/ 2,
            (vect3NodeCoord1.z + vect3NodeCoord2.z)/ 2,
        )

        var geometryCylinder = new THREE.CylinderGeometry(
            0.1 / 2 * 0.6 * scaleDisplay, 0.1 / 2 * 0.6 * scaleDisplay, 1 ,10);
        geometryCylinder.center();
        let vect3Direction = vect3NodeCoord1.sub(vect3NodeCoord2)
        let scaleLength = vect3Direction.length()
        geometryCylinder.scale(1, scaleLength * scaleDisplay, 1);

        var materialCylinder = new THREE.MeshBasicMaterial({ 
            color: beamColor,
            transparent: true,
            opacity: 0.7,});

        var meshCylinder = new THREE.Mesh(geometryCylinder, materialCylinder);
        meshCylinder.position.x = vect3NodeCoordMean.x * scaleDisplay;
        meshCylinder.position.y = vect3NodeCoordMean.y * scaleDisplay;
        meshCylinder.position.z = vect3NodeCoordMean.z * scaleDisplay;

        meshCylinder.name = "node number: " + formatInt(key)
            + " Coord: " + formatFloat(vect3NodeCoord1.x) 
            + ", " + formatFloat(vect3NodeCoord1.y) 
            + ", " + formatFloat(vect3NodeCoord1.z) 
            + " Coord: " + formatFloat(vect3NodeCoord2.x) 
            + ", " + formatFloat(vect3NodeCoord2.y) 
            + ", " + formatFloat(vect3NodeCoord2.z) 

        meshCylinder.targetColor = beamColor;
        meshCylinder.displayInfo = "element number: " + formatInt(key)

        let quaternionRotation = new THREE.Quaternion();
        quaternionRotation.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(
                ...vect3Direction.divideScalar(scaleLength).toArray())
        )
        meshCylinder.quaternion.copy(quaternionRotation);
        listMeshBeam.push(meshCylinder)
        scene.add(meshCylinder);
        console.log( new THREE.Vector3(vect3Direction.divideScalar(scaleLength)))
        console.log(quaternionRotation)
        console.log(meshCylinder)
    }
}


export function initializeShellMesh(dictElementInfo, dictNodeInfo){
    var listKeys = Object.keys(dictElementInfo);
    // clear existing mesh 
    while (listMeshShell.length > 0){
        scene.remove(listMeshShell.pop());
    }
    for (var iShell= 0; iShell < listKeys.length; iShell++) {
        let key = listKeys[iShell];
        let node_number_1 = dictElementInfo[key]["listNodeNumber"][0]
        let node_number_2 = dictElementInfo[key]["listNodeNumber"][1]
        let node_number_3 = dictElementInfo[key]["listNodeNumber"][2]
        let node_number_4 = dictElementInfo[key]["listNodeNumber"][3]

        let vect3NodeCoord1 = new THREE.Vector3(
            dictNodeInfo[node_number_1]["coordinate"][0],
            dictNodeInfo[node_number_1]["coordinate"][2],
            dictNodeInfo[node_number_1]["coordinate"][1])
        let vect3NodeCoord2 = new THREE.Vector3(
            dictNodeInfo[node_number_2]["coordinate"][0],
            dictNodeInfo[node_number_2]["coordinate"][2],
            dictNodeInfo[node_number_2]["coordinate"][1])
        let vect3NodeCoord3 = new THREE.Vector3(
            dictNodeInfo[node_number_3]["coordinate"][0],
            dictNodeInfo[node_number_3]["coordinate"][2],
            dictNodeInfo[node_number_3]["coordinate"][1])
        let vect3NodeCoord4 = new THREE.Vector3(
            dictNodeInfo[node_number_4]["coordinate"][0],
            dictNodeInfo[node_number_4]["coordinate"][2],
            dictNodeInfo[node_number_4]["coordinate"][1])

        let vect3NodeCoordMean = new THREE.Vector3(
            (vect3NodeCoord1.x + vect3NodeCoord2.x + vect3NodeCoord3.x 
                + vect3NodeCoord4.x)/ 4, 
            (vect3NodeCoord1.y + vect3NodeCoord2.y + vect3NodeCoord3.y 
                + vect3NodeCoord4.y)/ 4, 
            (vect3NodeCoord1.z + vect3NodeCoord2.z + vect3NodeCoord3.z 
                + vect3NodeCoord4.z)/ 4
        )

        var geometryShell = new ConvexGeometry(
            [vect3NodeCoord1, vect3NodeCoord2, 
                vect3NodeCoord3, vect3NodeCoord4])
        geometryShell.center();

        geometryShell.scale(scaleDisplay, scaleDisplay, scaleDisplay);

        var materialShell = new THREE.MeshBasicMaterial({ 
            color: shellColor,
            transparent: true,
            opacity: 0.7,});

        var meshShell = new THREE.Mesh(geometryShell, materialShell);
        meshShell.position.x = vect3NodeCoordMean.x * scaleDisplay;
        meshShell.position.y = vect3NodeCoordMean.y * scaleDisplay;
        meshShell.position.z = vect3NodeCoordMean.z * scaleDisplay;

        meshShell.name = "element number: " + formatInt(key)
            + " Coord: " + formatFloat(vect3NodeCoord1.x) 
            + ", " + formatFloat(vect3NodeCoord1.y) 
            + ", " + formatFloat(vect3NodeCoord1.z) 
            + " Coord: " + formatFloat(vect3NodeCoord2.x) 
            + ", " + formatFloat(vect3NodeCoord2.y) 
            + ", " + formatFloat(vect3NodeCoord2.z) 
            + " Coord: " + formatFloat(vect3NodeCoord3.x) 
            + ", " + formatFloat(vect3NodeCoord3.y) 
            + ", " + formatFloat(vect3NodeCoord3.z) 
            + " Coord: " + formatFloat(vect3NodeCoord4.x) 
            + ", " + formatFloat(vect3NodeCoord4.y) 
            + ", " + formatFloat(vect3NodeCoord4.z) 

        meshShell.targetColor = shellColor;
        meshShell.displayInfo = "element number: " + formatInt(key)

        listMeshShell.push(meshShell)
        scene.add(meshShell);
    }
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
    listMeshArrowHelper.push(arrowHelperX)
    listMeshArrowHelper.push(arrowHelperX)
    listMeshArrowHelper.push(arrowHelperX)
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render()
};


function functionResetNodeColor(valueColor){
    listMeshNode.forEach(function(MeshNode){
        MeshNode.material.color.set(valueColor);
    })
}
function functionResetBeamColor(){
    listMeshBeam.forEach(function(MeshBeam){
        MeshBeam.material.color.set(MeshBeam.targetColor);
    })
}

function functionResetShellColor(){
    listMeshShell.forEach(function(Mesh){
        Mesh.material.color.set(Mesh.targetColor);
    })
}

export function functionSetNodeScale(valueScale){
    if (listMeshNode){
        listMeshNode.forEach(function(MeshNode){
            MeshNode.scale.set(valueScale, valueScale, valueScale);
        })
    }
}

export function functionSetNodeOpacity(valueOpacity){
    if (listMeshNode){
        listMeshNode.forEach(function(MeshNode){
            MeshNode.material.opacity = valueOpacity;
        })
    }
}

export function functionSetNodeColor(valueColor){
    nodeColor = valueColor;
}
export function functionSetBeamScale(valueScale){
    if (listMeshBeam){
        listMeshBeam.forEach(function(Mesh){
            Mesh.scale.set(valueScale, 1, valueScale);
        })
    }
}

export function functionSetBeamOpacity(valueOpacity){
    if (listMeshBeam){
        listMeshBeam.forEach(function(MeshBeam){
            MeshBeam.material.opacity = valueOpacity;
        })
    }
}

export function functionSetBeamColor(valueColor){
    listMeshBeam.forEach(function(MeshBeam){
        MeshBeam.targetColor = valueColor;
    })
}

export function functionSetRandomBeamColor(){
    for (let iBeam=0; iBeam < listMeshBeam.length; iBeam++){
        let color = new THREE.Color( 0xffffff );
        color.setHex( Math.random() * 0xffffff );
        listMeshBeam[iBeam].material.color.set(color)
        listMeshBeam[iBeam].targetColor = color;
    }
}


export function functionSetShellOpacity(valueOpacity){
    if (listMeshShell){
        listMeshShell.forEach(function(Mesh){
            Mesh.material.opacity = valueOpacity;
        })
    }
}

export function functionSetShellColor(valueColor){
    listMeshShell.forEach(function(Mesh){
        Mesh.targetColor = valueColor;
    })
}

export function functionSetShellDisplay(boolDisplay){
    boolShellDisplay = boolDisplay;
    listMeshShell.forEach(function(Mesh){
        Mesh.visible = boolDisplay;
    })
}

export function functionSetRandomShellColor(){
    for (let iShell=0; iShell< listMeshShell.length; iShell++){
        let color = new THREE.Color( 0xffffff );
        color.setHex( Math.random() * 0xffffff );
        listMeshShell[iShell].material.color.set(color)
        listMeshShell[iShell].targetColor = color;
    }
}



function render() {
    // Change color of hover object and show its name (sensor index)
    raycaster.setFromCamera(vect2PointerCoord, camera);

    if (listMeshNode || listMeshBeam || listMeshShell){
        const intersects = raycaster.intersectObjects(
            Array.prototype.concat(listMeshNode, listMeshBeam, listMeshShell), 
            false);
        if ( intersects.length > 0 ) {
            if ( INTERSECTED != intersects[0].object ) {
                INTERSECTED = intersects[0].object;
                INTERSECTED.material.color.setHex(0xffffff);
            }
        } else {
            // let valueColor = document.getdomElementById("controlPanel").value;
            functionResetNodeColor(nodeColor);
            functionResetBeamColor();
            functionResetShellColor();
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