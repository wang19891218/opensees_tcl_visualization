import './style.css'

import { parseTcl } from './utils';
import { initializeNodeMesh, functionSetNodeScale, functionSetNodeColor } from './visualizationBuilding';
import { inputNodeScale, inputNodeColor } from './controlPanel';

inputNodeScale.on("change", (event) => {
    functionSetNodeScale(event.value);
});
inputNodeColor.on("change", (event) => {
    functionSetNodeColor(event.value);
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
            initializeNodeMesh(dictNodeInfo);
            fileSelector.value = "";
        }
    })(reader);
    reader.readAsText(fileList[0]);
});