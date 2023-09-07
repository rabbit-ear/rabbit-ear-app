import { get, writable, derived } from "svelte/store";
import {
	ASSIGN_SWAP,
	SELECT_EDGE,
} from "../app/keys.js";
import {
	Selection,
	Highlight,
} from "./Select.js";
import {
	RulerLines,
	RulerRays,
} from "./Ruler.js"
import {
	Presses,
	Moves,
	Releases,
	UIGraph,
	UILines,
	UIRays,
} from "./UI.js";
import ToolEdge from "../tools/edge/index.js";

// any modifier or attribute or detail necessary
// for the main tool.
export const AssignType = writable(ASSIGN_SWAP);
export const FoldAngleValue = writable(90);
export const ScribbleSmooth = writable(true);
export const ScribbleSmoothAmount = writable(0.5);
export const ScribbleDensity = writable(0.5);
export const ScribbleWaitForConfirmation = writable(false);
export const RadialSnapDegrees = writable(22.5);
export const RadialSnapOffset = writable(0);
export const FoldThroughLayers = writable(true);

export const ToolNew = writable(ToolEdge);
const ToolNewSet = ToolNew.set;
ToolNew.set = (tool) => {
	Presses.set([]);
	Moves.set([]);
	Releases.set([]);
	Highlight.reset();
	UIGraph.set({});
	RulerLines.set([]);
	RulerRays.set([]);
	UILines.set([]);
	UIRays.set([]);
	return ToolNewSet(tool);
};

export const ToolList = writable([]);

/**
 * @description for the UI. which tool step is currently in progress
 * based on the collected touch data.
 */
// const {
// 	subscribe: subElementSelect,
// 	set: setElementSelect,
// 	update: updateElementSelect,
// } = writable(SELECT_EDGE);

// export const ElementSelect = {
// 	subscribe: subElementSelect,
// 	update: updateElementSelect,
// 	set: (e) => {
// 		Selection.reset();
// 		return setElementSelect(e);
// 	},
// };

export const ElementSelect = writable(SELECT_EDGE);
const ElementSelectSet = ElementSelect.set;
ElementSelect.set = (e) => {
	Selection.reset();
	return ElementSelectSet(e);
}

export const SelectHoverIndex = writable({
	vertex: undefined,
	edge: undefined,
	face: undefined,
});
