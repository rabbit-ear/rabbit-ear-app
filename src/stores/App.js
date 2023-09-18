import { writable, derived } from "svelte/store";
import { ViewBox } from "./ViewBox.js";

// these are immutable. a bit like compiler directives.
// these will only change to target different builds.
export const ShowHeader = true;
export const UndoHistoryLength = 30;

// app preferences and settings
export const NewEdgeAssignment = writable("F");
// export const Snapping = writable(true);
export const ShowFlatFoldableIssues = writable(true);
export const ShowGrid = writable(true);
export const ShowAxes = writable(true);
export const ShowIndices = writable(false);
export const RulersAutoClear = writable(true);

// show/hide components
export const ShowSimulator = writable(true);
export const ShowTerminal = writable(true);
export const ShowCodeEditor = writable(false);
export const ShowFrames = writable(true);

// DOM element references
export const DialogNewFile = writable(undefined);
export const DialogNewFrame = writable(undefined);
export const TerminalTextarea = writable(undefined);
export const TerminalValue = writable(undefined);
export const InputFile = writable(undefined);

// vertex radius is is dynamic according to the zoom level
// this number is a scale of the size of the viewbox.
export const VertexRadiusFactor = writable(0.00666);

// svg circle elements query this for their radius value.
export const VertexRadius = derived(
	[ViewBox, VertexRadiusFactor],
	([$ViewBox, $VertexRadiusFactor]) => (
		Math.max($ViewBox[2], $ViewBox[3]) * $VertexRadiusFactor
	),
	0.00666,
);
