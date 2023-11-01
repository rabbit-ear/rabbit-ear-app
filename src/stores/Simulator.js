import {
	writable,
	derived,
} from "svelte/store";
import { Tool } from "./UI.js";

//
// communication from outside to Origami Simulator
//

// turn on/off Origami Simulator's folding engine
export const Active = writable(true);

// fold the origami model, float (0.0-1.0)
export const FoldAmount = writable(0.15);

// override the material to show the model's strain forces
export const Strain = writable(false);

// tool is either ["trackball", "pull"], this determines how
// to respond to a user interface: rotate model or pull a vertex
export const SimulatorTool = derived(
	Tool,
	($Tool) => $Tool && $Tool.name === "vertex" ? "pull" : "trackball",
	"trackball",
);

//
// communication from Origami Simulator to outside
//

// vertex displacement error relayed back from the simulator
export const VertexError = writable(0);

// reset the vertices back to their starting location
export const Reset = writable(() => {});

// ask origami simulator to export the current 3D state
export const ExportModel = writable(() => {});

//
export const ResetView = writable(() => {});

// get the current FOLD file being rendered by Origami Simulator
export const SimulatorFOLD = writable(() => ({}));
