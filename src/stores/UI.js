import { get, writable, derived } from "svelte/store";
import { SELECT_EDGE } from "../tools/Select/stores.js"; // todo get rid of
import {
	RulerLines,
	RulerRays,
} from "./Ruler.js"
import { Highlight } from "./Select.js";
import { ViewBox } from "./ViewBox.js";
// a hash lookup of every keyboard key currently being pressed
// where the dictionary keys are the ______ (key characters?)
export const Keyboard = writable({});

// every touch input
export const Pointer = writable(undefined); // {number[]} point
export const SnapPoint = writable(undefined); // {number[]} point
// export const PointerDidSnap = writable(false); // {boolean}

// there are a few different ways of offering the user UI feedback
// Lines and Rays are infinite objects which get clipped in the viewbox,
// UIGraph is a custom graph (often used as a subgraph of the one on screen)
// which will appear highlighted and on top of the current viewing graph.
// UIGraph is a FOLD object.
export const UIGraph = writable({});
export const UILines = writable([]);
export const UIRays = writable([]);
UILines.add = (newRulers) => UILines.update((r) => [...r, ...newRulers]);
UIRays.add = (newRulers) => UIRays.update((r) => [...r, ...newRulers]);
/**
 *
 */
export const resetUI = () => {
	Pointer.set(undefined);
	SnapPoint.set(undefined);
	// PointerDidSnap.set(false);
	Highlight.reset();
	UIGraph.set({});
	UILines.set([]);
	UIRays.set([]);
	RulerLines.set([]);
	RulerRays.set([]);
};
/**
 * @description Tool
 */
export const Tool = writable(undefined);
const ToolSet = Tool.set;
Tool.set = (newTool) => {
	const oldTool = get(Tool);
	if (oldTool && oldTool.unsubscribe) { oldTool.unsubscribe(); }
	resetUI();
	if (newTool && newTool.subscribe) { newTool.subscribe(); }
	return ToolSet(newTool);
};
/**
 * @description
 */
const UIEpsilonFactor = 0.01;
/**
 * @description
 */
export const UIEpsilon = derived(
	ViewBox,
	($ViewBox) => Math.max($ViewBox[2], $ViewBox[3]) * UIEpsilonFactor,
	0.05,
);
