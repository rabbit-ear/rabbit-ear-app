import {
	writable,
} from "svelte/store";

export const APP_NAME = "Rabbit Ear";
/**
 * @description Build Target, either Tauri (false) or Browsers (true).
 * Update: browser won't build any more it's basically hard-coded
 * to only build in Tauri now. Someday, let's make web work again.
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
export const EpsilonFactor = writable(1e-3);

// for all of these boolean types, .getItem() will return "null"
// if the item doesn't exist (first load), in which case, use
// the ternary operator to get the desired default value.

// export const VerticalUp = writable(true);
export const VerticalUp = writable(
	localStorage.getItem("VerticalUp") !== null
		? localStorage.getItem("VerticalUp") === "true"
		: true);
/**
 * @description Show/Hide various things across the app.
 */
export const ShowGrid = writable(
	localStorage.getItem("ShowGrid") !== null
		? localStorage.getItem("ShowGrid") === "true"
		: true);

export const ShowAxes = writable(
	localStorage.getItem("ShowAxes") !== null
		? localStorage.getItem("ShowAxes") === "true"
		: true);

export const ShowIndices = writable(
	localStorage.getItem("ShowIndices") !== null
		? localStorage.getItem("ShowIndices") === "true"
		: false);

export const ShowFlatFoldableIssues = writable(
	localStorage.getItem("ShowFlatFoldableIssues") !== null
		? localStorage.getItem("ShowFlatFoldableIssues") === "true"
		: true);

export const ShowCodeEditor = writable(
	localStorage.getItem("ShowCodeEditor") !== null
		? localStorage.getItem("ShowCodeEditor") === "true"
		: false);

export const ShowFrames = writable(
	localStorage.getItem("ShowFrames") !== null
		? localStorage.getItem("ShowFrames") === "true"
		: true);

/**
 * @description A few various commands have the effect of creating
 * new edges in the graph, by default, these new edges will
 * take on this assignment.
 */
export const NewEdgeAssignment = writable(
	localStorage.getItem("NewEdgeAssignment") || "F");

export const GridType = writable(
	localStorage.getItem("GridType") || "square");

export const AutoSolveLayers = writable(
	localStorage.getItem("AutoSolveLayers") !== null
		? localStorage.getItem("AutoSolveLayers") === "true"
		: true);

export const SolveLayersOnBackground = writable(
	localStorage.getItem("SolveLayersOnBackground") !== null
		? localStorage.getItem("SolveLayersOnBackground") === "true"
		: true);

/**
 * @description DOM element references.
 */
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
VerticalUp.subscribe(value => localStorage
	.setItem("VerticalUp", String(value)));
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
GridType.subscribe(value => localStorage
	.setItem("GridType", value));
AutoSolveLayers.subscribe(value => localStorage
	.setItem("AutoSolveLayers", value));
SolveLayersOnBackground.subscribe(value => localStorage
	.setItem("SolveLayersOnBackground", value));
