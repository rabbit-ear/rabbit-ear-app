import { writable } from "svelte/store";

//
// communication from outside to Origami Simulator
//

// turn on/off Origami Simulator's folding engine
export const active = writable(false);

// fold the origami model, float (0.0-1.0)
export const foldAmount = writable(0.15);

// override the material to show the model's strain forces
export const strain = writable(false);

// tool is either ["trackball", "pull"], this determines how
// to respond to a user interface: rotate model or pull a vertex
export const tool = writable("trackball");

//
// communication from Origami Simulator to outside
//

// vertex displacement error relayed back from the simulator
export const error = writable(0);

// reset the vertices back to their starting location
export const reset = writable(() => {});

// ask origami simulator to export the current 3D state
export const exportModel = writable(() => {});
