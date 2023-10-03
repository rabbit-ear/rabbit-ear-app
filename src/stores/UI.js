import { get, writable, derived } from "svelte/store";
import { assignLists } from "../js/arrays.js";
import {
	RulerLines,
	RulerRays,
} from "./Ruler.js"
import { ViewBoxCP } from "./ViewBox.js";
/**
 * @description a UI touch event, coming from a pointer device, will have some
 * built-in error correcting (like snapping, for example), and this behavior
 * is zoom-level dependent. This is the factor out of 1 which is
 * scaled to the viewbox to get this ui-epsilon floating point error factor.
 */
const UIEpsilonFactor = 0.01;
/**
 * @description a UI touch event, coming from a pointer device, will have some
 * built-in error correcting (like snapping, for example), and this behavior
 * is zoom-level dependent. Use this variable to get an appropriate error-
 * correcting value.
 */
export const UIEpsilonCP = derived(
	ViewBoxCP,
	($ViewBoxCP) => (
		Math.max($ViewBoxCP[2], $ViewBoxCP[3]) * UIEpsilonFactor
	),
	0.05,
);
/**
 * @description a hash lookup of every keyboard key currently being pressed
 * where the dictionary's keys are numbers, the numbers being event.keyCode.
 * and the value will be "true" if the key is pressed. If the key is not
 * pressed, the key will not exist.
 */
export const Keyboard = writable({});

/**
 * @description These Pointer values contain information about the UI
 * pointer device input state, the values will be displayed in the
 * App Panels to give a kind of user-feedback to the pointer state.
 */
export const Pointer = writable(undefined); // {number[]} point
export const SnapPoint = writable(undefined); // {number[]} point

/**
 * @description This app has some built-in ways of visualizing
 * user interface information: lines, rays, and the most complex,
 * an entire graph. Lines and Rays are infinite objects, which when visualized,
 * become clipped in the viewbox, and the UIGraph is a FOLD object, which can
 * contain vertices, edges, and faces, and will render as a highlighted object
 * on top of the actual graph model.
 */
export const UIGraph = writable({});
export const UILines = writable([]);
export const UIRays = writable([]);
UILines.add = (newRulers) => UILines.update((r) => [...r, ...newRulers]);
UIRays.add = (newRulers) => UIRays.update((r) => [...r, ...newRulers]);
/**
 * @description This is the currently selected UI tool, as seen on the
 * toolbar (left side of screen). Tool definitions can be found inside
 * the tools/ folder.
 */
export const Tool = writable(undefined);
/**
 * @description The tool setter will reset the UI between tools and
 * call any "subscribe" or "unsubscribe" methods, if they exist,
 * intended to cleanup or initialize Svelte stores which are specific
 * to each tool.
 */
Tool.set = (newTool) => Tool.update(oldTool => {
	if (oldTool && oldTool.unsubscribe) { oldTool.unsubscribe(); }
	resetUI();
	if (newTool && newTool.subscribe) { newTool.subscribe(); }
	return newTool;
});

export const emptyComponentObject = () => (
	{ vertices: [], edges: [], faces: [] }
);
/**
 * @description Similar to "Select" but different both visually
 * and functionally. Selected graph components will change color
 * (like, a bright yellow color), Highlighted components will more subtly
 * emphasize their presence. For example, a highlighted edge will simply
 * grow in stroke-width, but visually still show its assignment-color-coding,
 * this is used in the "Assignment" tool. Additionally, Highlighted graph
 * components have no functional purpose, unlike Select, which can be
 * copy/pasted/duplicated/transformed.
 */
export const Highlight = writable(emptyComponentObject());
Highlight.reset = () => Highlight.set(emptyComponentObject()),
Highlight.addVertices = (verts) => Highlight.update(obj => {
	assignLists(obj.vertices, verts);
	return obj;
});
Highlight.addEdges = (edges) => Highlight.update(obj => {
	assignLists(obj.edges, edges);
	return obj;
});
Highlight.addFaces = (faces) => Highlight.update(obj => {
	assignLists(obj.faces, faces);
	return obj;
});
Highlight.setVertices = (vertices) => Highlight.update(_ => ({
	vertices, edges: [], faces: [],
}));
Highlight.setEdges = (edges) => Highlight.update(_ => ({
	vertices: [], edges, faces: [],
}));
Highlight.setFaces = (faces) => Highlight.update(_ => ({
	vertices: [], edges: [], faces,
}));
/**
 * @description This will reset all visual feedback coming from the UI,
 * for example, this is called when switching between UI tools to reset
 * all visual feedback.
 */
export const resetUI = () => {
	Pointer.set(undefined);
	SnapPoint.set(undefined);
	Highlight.reset();
	UIGraph.set({});
	UILines.set([]);
	UIRays.set([]);
	RulerLines.set([]);
	RulerRays.set([]);
};