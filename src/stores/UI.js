import { writable, derived } from "svelte/store";
import { SELECT_EDGE } from "../app/keys.js";
// import ToolEdge from "../tools/edge/index.js";
import {
	RulerLines,
	RulerRays,
} from "./Ruler.js"
import { Highlight } from "./Select.js";
// a hash lookup of every keyboard key currently being pressed
// where the dictionary keys are the ______ (key characters?)
export const Keyboard = writable({});

// every touch input
export const Presses = writable([]); // {number[][]} array of points
export const Moves = writable([]); // {number[][]} array of points
export const Releases = writable([]); // {number[][]} array of points
export const Current = writable(undefined); // {number[]} point
export const CurrentSnap = writable(undefined); // {number[]} point

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
 * @description for the UI. which tool step is currently in progress
 * based on the collected touch data.
 */
export const ElementSelect = writable(SELECT_EDGE);
const ElementSelectSet = ElementSelect.set;
ElementSelect.set = (e) => {
	Selection.reset();
	return ElementSelectSet(e);
};
/**
 *
 */
export const resetUI = () => {
	Presses.set([]);
	Moves.set([]);
	Releases.set([]);
	Current.set(undefined);
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
// export const Tool = writable(ToolEdge);
export const Tool = writable(undefined);
const ToolSet = Tool.set;
Tool.set = (tool) => {
	resetUI();
	return ToolSet(tool);
};
