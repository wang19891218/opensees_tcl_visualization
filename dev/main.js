import './style.css'

import { parseTcl } from './utils';
import * as visualizationBuilding from './visualizationBuilding';
import * as controlPanel from './controlPanel';

controlPanel.inputNodeScale.on("change", (event) => {
    visualizationBuilding.functionSetNodeScale(event.value);
});
controlPanel.inputNodeOpacity.on("change", (event) => {
    visualizationBuilding.functionSetNodeOpacity(event.value);
});
controlPanel.inputNodeColor.on("change", (event) => {
    visualizationBuilding.functionSetNodeColor(event.value);
});
controlPanel.inputBeamScale.on("change", (event) => {
    visualizationBuilding.functionSetBeamScale(event.value);
});
controlPanel.inputBeamOpacity.on("change", (event) => {
    visualizationBuilding.functionSetBeamOpacity(event.value);
});
controlPanel.inputBeamColor.on("change", (event) => {
    visualizationBuilding.functionSetBeamColor(event.value);
});
controlPanel.inputButtonRandomBeamColor.on("click", () => {
    visualizationBuilding.functionSetRandomBeamColor();
});
controlPanel.inputShellDisplay.on("change", (event) => {
    console.log(event.value)
    visualizationBuilding.functionSetShellDisplay(event.value);
});
controlPanel.inputShellOpacity.on("change", (event) => {
    visualizationBuilding.functionSetShellOpacity(event.value);
});
controlPanel.inputShellColor.on("change", (event) => {
    visualizationBuilding.functionSetShellColor(event.value);
});
controlPanel.inputButtonRandomShellColor.on("click", () => {
    visualizationBuilding.functionSetRandomShellColor();
});





const fileSelector = document.getElementById('file-selector');
fileSelector.addEventListener('change', (event) => {
    const fileList = event.target.files;
    const reader = new FileReader();
    reader.onload = (function(reader)
    {
        return function()
        {
            var contents = reader.result;
            var lines = contents.split('\n');
            var [dictNodeInfo, dictBeamElementInfo, dictShellElementInfo] = parseTcl(lines)
            var strInnerHTML = "<p id='tcl_txt_p'>";
            for (var i_line =9; i_line < lines.length; i_line++) {
                strInnerHTML += lines[i_line] + "<br>";
            }
            document.getElementById('tcl_txt').innerHTML= strInnerHTML
            visualizationBuilding.initializeNodeMesh(dictNodeInfo);
            visualizationBuilding.initializeBeamMesh(dictBeamElementInfo, dictNodeInfo);
            visualizationBuilding.initializeShellMesh(dictShellElementInfo, dictNodeInfo);
            fileSelector.value = "";
            fileSelector.title= "";
        }
    })(reader);
    reader.readAsText(fileList[0]);
});



window.onload = window.resize = function() {
    document.getElementById("content").style.height = window.innerHeight + "px";
    document.getElementById("tcl_txt").style.height 
        = document.getElementById("buildingVisualization").clientHeight
        - document.getElementById("controlPanel").clientHeight
        - document.getElementById("tcl_input").clientHeight  + "px";
    console.log(window.innerHeight)
    console.log(document.getElementById("controlPanel").clientHeight)
    console.log(document.getElementById("tcl_input").clientHeight)
}