import { writable, derived } from "svelte/store";
import { ViewBox } from "./ViewBox.js";
/**
 * @description App settings which are immutable compiler directives.
 * these will only change to target different builds.
 */
export const ShowMenu = true;
/**
 * @description Show/Hide various things across the app.
 */
export const ShowGrid = writable(true);
export const ShowAxes = writable(true);
export const ShowIndices = writable(false);
export const ShowFlatFoldableIssues = writable(true);
export const ShowCodeEditor = writable(false);
export const ShowFrames = writable(true);
export const ShowStaticOrSimulator = writable(false); // false: static, true: simulator
/**
 * @description A few various commands have the effect of creating
 * new edges in the graph, by default, these new edges will
 * take on this assignment.
 */
export const NewEdgeAssignment = writable("F");
/**
 * @description DOM element references.
 */
export const DialogNewFile = writable(undefined);
export const DialogNewFrame = writable(undefined);
export const TerminalTextarea = writable(undefined);
export const TerminalValue = writable(undefined);
export const InputFile = writable(undefined);
/**
 * @description vertex radius is is dynamic according to the zoom level
 * this number is a scale of the size of the viewbox.
 */
export const VertexRadiusFactor = writable(0.00666);
/**
 * @description SVG circle elements use this for their radius value.
 */
export const VertexRadius = derived(
	[ViewBox, VertexRadiusFactor],
	([$ViewBox, $VertexRadiusFactor]) => (
		Math.max($ViewBox[2], $ViewBox[3]) * $VertexRadiusFactor
	),
	0.00666,
);
