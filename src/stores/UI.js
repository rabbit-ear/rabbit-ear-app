import { writable, derived } from "svelte/store";

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

export const ResetUI = () => {
	Presses.set([]);
	Moves.set([]);
	Releases.set([]);
	Current.set(undefined);
	UIGraph.set({});
	UILines.set([]);
	UIRays.set([]);
};
