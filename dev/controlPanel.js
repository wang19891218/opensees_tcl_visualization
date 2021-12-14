import { Pane } from 'tweakpane';

// Control panel
const controlPane = new Pane({
    container: document.getElementById('controlPanel'),
});

// export const pane = new Pane();
const PARAMS = {
    model_name: "",
    showData: false,
    nodeScale: 1,
    nodeColor: "#ffffff",
    nodeOpacity: 0.7,
    beamScale: 1,
    beamColor: "#ffffff",
    beamOpacity: 0.7,
    shellDisplay: true,
    shellColor: "#ffffff",
    shellOpacity: 0.7,
    rotation_y: 0,
    color: '#0f0',
};

export var intputModelName = controlPane.addInput(PARAMS, 'model_name');
export var intputShowData = controlPane.addInput(PARAMS, 'showData');

export var inputNodeScale = controlPane.addInput(PARAMS, 'nodeScale', {
    min: 0.001,
    max: 2,
});
export var inputNodeOpacity = controlPane.addInput(PARAMS, 'nodeOpacity', { 
    min: 0,
    max: 1,
});
export var inputNodeColor = controlPane.addInput(PARAMS, 'nodeColor', { });


export var inputBeamScale = controlPane.addInput(PARAMS, 'beamScale', {
    min: 0.001,
    max: 2,
});
export var inputBeamOpacity = controlPane.addInput(PARAMS, 'beamOpacity', { 
    min: 0,
    max: 1,
});
export var inputBeamColor = controlPane.addInput(PARAMS, 'beamColor', { });

export var inputButtonRandomBeamColor = controlPane.addButton({
    title: 'RandomBeamColor'})

export var inputShellDisplay = controlPane.addInput(PARAMS, 'shellDisplay', { 
    title: "DisplayShellElements"
});
export var inputShellOpacity = controlPane.addInput(PARAMS, 'shellOpacity', { 
    min: 0,
    max: 1,
});



export var inputShellColor = controlPane.addInput(PARAMS, 'shellColor', { });



export var inputButtonRandomShellColor = controlPane.addButton({title: 'RandomShellColor'})