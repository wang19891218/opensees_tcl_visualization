import './style.css'

import { parseTcl } from './utils';
import { initializeNodeMesh, functionSetNodeScale, functionSetNodeColor } from './visualizationBuilding';
import { inputNodeScale, inputNodeColor } from './controlPanel';

console.log("functions imported")

inputNodeScale.on("change", (event) => {
    functionSetNodeScale(event.value);
});
inputNodeColor.on("change", (event) => {
    console.log(event);
    functionSetNodeColor(event.value);
});

const fileSelector = document.getElementById('file-selector');
fileSelector.addEventListener('change', (event) => {
    console.log(event);
    const fileList = event.target.files;
    console.log(fileList);

    const reader = new FileReader();
    console.log("start define reader");
    reader.onload = (function(reader)
    {
        return function()
        {
            var contents = reader.result;
            var lines = contents.split('\n');
            var [dictNodeInfo, dictElementInfo] = parseTcl(lines)
            console.log(dictNodeInfo);
            console.log(dictElementInfo);
            var strInnerHTML = "<p>";
            for (var i_line =9; i_line < lines.length; i_line++) {
                strInnerHTML += lines[i_line] + "<br>";
            }
            document.getElementById('tcl_txt').innerHTML= strInnerHTML
            initializeNodeMesh(dictNodeInfo);
        }
    })(reader);
    reader.readAsText(fileList[0]);
    console.log(reader)
    console.log(reader.result)
});