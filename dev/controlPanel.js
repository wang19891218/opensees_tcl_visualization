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
    beamScale: 1,
    beamColor: "#ffffff",
    rotation_y: 0,
    color: '#0f0',
};

export var intputModelName = controlPane.addInput(PARAMS, 'model_name');

export var intputShowData = controlPane.addInput(PARAMS, 'showData');

export var inputNodeScale = controlPane.addInput(PARAMS, 'nodeScale', {
    min: 0.001,
    max: 10,
});

export var inputNodeColor = controlPane.addInput(PARAMS, 'nodeColor', { });

export var inputBeamScale = controlPane.addInput(PARAMS, 'beamScale', {
    min: 0.001,
    max: 10,
});

export var inputBeamColor = controlPane.addInput(PARAMS, 'beamColor', { });

export var inputButtonRandomColor = controlPane.addButton({title: 'RandomBeamColor'})