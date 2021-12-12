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
controlPanel.inputButtonRandomColor.on("click", () => {
    visualizationBuilding.functionSetRandomBeamColor();
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
            var [dictNodeInfo, dictElementInfo] = parseTcl(lines)
            var strInnerHTML = "<p id='tcl_txt_p'>";
            for (var i_line =9; i_line < lines.length; i_line++) {
                strInnerHTML += lines[i_line] + "<br>";
            }
            document.getElementById('tcl_txt').innerHTML= strInnerHTML
            visualizationBuilding.initializeNodeMesh(dictNodeInfo);
            visualizationBuilding.initializeBeamMesh(dictElementInfo, dictNodeInfo);
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