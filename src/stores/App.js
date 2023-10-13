import {
	writable,
	derived,
} from "svelte/store";

// local storage list
//
// {boolean} ShowGrid
// {boolean} ShowAxes
// {boolean} ShowIndices
// {boolean} ShowFlatFoldableIssues
// {boolean} ShowCodeEditor
// {boolean} ShowFrames
// {string} NewEdgeAssignment

// console.log("local storage show frames", localStorage.getItem("ShowFrames"));

/**
 * @description Build Target, either Tauri (false) or Browsers (true).
 */
export const BuildTargetWeb = false;
/**
 * @description App settings which are immutable compiler directives.
 * these will only change to target different builds.
 */
export const ShowMenu = false;
/**
 * @description App settings, mutable.
 */
export const VerticalUp = writable(true);
/**
 * @description Show/Hide various things across the app.
 */
export const ShowGrid = writable(
	localStorage.getItem("ShowGrid") === "true" || true,
);
export const ShowAxes = writable(
	localStorage.getItem("ShowAxes") === "true" || true,
);
export const ShowIndices = writable(
	localStorage.getItem("ShowIndices") === "true" || false,
);
export const ShowFlatFoldableIssues = writable(
	localStorage.getItem("ShowFlatFoldableIssues") === "true" || true,
);
export const ShowCodeEditor = writable(
	localStorage.getItem("ShowCodeEditor") === "true" || false,
);
export const ShowFrames = writable(
	localStorage.getItem("ShowFrames") === "true" || true,
);

export const ShowStaticOrSimulator = writable(false); // false: static, true: simulator

// flat foldable folded forms will render in SVG by default.
export const Prefer3D = writable(false);

/**
 * @description A few various commands have the effect of creating
 * new edges in the graph, by default, these new edges will
 * take on this assignment.
 */
export const NewEdgeAssignment = writable(
	localStorage.getItem("NewEdgeAssignment") || "F",
);
/**
 * @description DOM element references.
 */
export const DialogNewFile = writable(undefined);
export const DialogNewFrame = writable(undefined);
export const DialogImportFile = writable(undefined);
export const DialogExportAs = writable(undefined);
export const TerminalTextarea = writable(undefined);
export const TerminalValue = writable(undefined);
export const InputFile = writable(undefined);

export const ShowPanelCanvas = writable(true);
export const ShowPanelTool = writable(true);
export const ShowPanelSimulator = writable(true);
export const ShowPanelFoldedForm = writable(true);
export const ShowPanelFile = writable(true);
export const ShowPanelStylePanel = writable(false);
export const ShowPanelModifiersPanel = writable(false);
export const ShowPanelModifiersSubPanel = writable(false);

// todo: global-level subscribe. needs unsubscribe
ShowGrid.subscribe(value => localStorage
	.setItem("ShowGrid", String(value)));
ShowAxes.subscribe(value => localStorage
	.setItem("ShowAxes", String(value)));
ShowIndices.subscribe(value => localStorage
	.setItem("ShowIndices", String(value)));
ShowFlatFoldableIssues.subscribe(value => localStorage
	.setItem("ShowFlatFoldableIssues", String(value)));
ShowCodeEditor.subscribe(value => localStorage
	.setItem("ShowCodeEditor", String(value)));
ShowFrames.subscribe(value => localStorage
	.setItem("ShowFrames", String(value)));
NewEdgeAssignment.subscribe(value => localStorage
	.setItem("NewEdgeAssignment", value));
