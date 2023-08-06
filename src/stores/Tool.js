import { get, writable, derived } from "svelte/store";
import {
	ASSIGN_SWAP,
	SELECT_EDGE,
	TOOL_SELECT,
	TOOL_DELETE,
	TOOL_CAMERA,
	TOOL_VERTEX,
	TOOL_EDGE,
	TOOL_SPLIT_EDGE,
	TOOL_TRANSLATE,
	TOOL_SCALE,
	TOOL_ASSIGN,
	TOOL_FOLD_ANGLE,
	TOOL_AXIOM_1,
	TOOL_AXIOM_2,
	TOOL_AXIOM_3,
	TOOL_AXIOM_4,
	TOOL_AXIOM_5,
	TOOL_AXIOM_6,
	TOOL_AXIOM_7,
	TOOL_KAWASAKI,
	TOOL_PLEAT,
	TOOL_SCRIBBLE,
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

// any modifier or attribute or detail necessary
// for the main tool.
export const AssignType = writable(ASSIGN_SWAP);
export const FoldAngleValue = writable(90);
export const ScribbleSmooth = writable(true);
export const ScribbleSmoothAmount = writable(0.5);
export const ScribbleDensity = writable(0.5);
export const ScribbleWaitForConfirmation = writable(false);
export const PleatCount = writable(4);

const { subscribe, set, update } = writable(TOOL_EDGE);

export const Tool = {
	subscribe,
	update,
	set: (t) => {
		Presses.set([]);
		Moves.set([]);
		Releases.set([]);
		Highlight.reset();
		UIGraph.set({});
		RulerLines.set([]);
		RulerRays.set([]);
		UILines.set([]);
		UIRays.set([]);
		switch (t) {
		case TOOL_VERTEX: break;
		default:
			// Selection.reset();
		}
		return set(t);
	},
};

const {
	subscribe: subElementSelect,
	set: setElementSelect,
	update: updateElementSelect,
} = writable(SELECT_EDGE);

export const ElementSelect = {
	subscribe: subElementSelect,
	update: updateElementSelect,
	set: (e) => {
		Selection.reset();
		return setElementSelect(e);
	},
};


/**
 * @description for the UI. which tool step is currently in progress
 * based on the collected touch data.
 */
export const ToolStep = derived(
	[Tool, Presses, Releases],
	([$Tool, $Presses, $Releases]) => {
		const pressesCount = $Presses.length;
		// const movesCount = $Moves.length;
		const releasesCount = $Releases.length;
		switch ($Tool) {
		case TOOL_SELECT: return pressesCount ? 1 : 0;
		case TOOL_DELETE: return 0;
		case TOOL_CAMERA: return 0;
		case TOOL_VERTEX: return 0;
		case TOOL_EDGE: return 0;
		case TOOL_SPLIT_EDGE: return 0;
		case TOOL_TRANSLATE: return 0;
		case TOOL_SCALE: return 0;
		case TOOL_ASSIGN: return 0;
		case TOOL_FOLD_ANGLE: return 0;
		case TOOL_AXIOM_1:
		case TOOL_AXIOM_2:
		case TOOL_AXIOM_3:
		case TOOL_AXIOM_4:
		case TOOL_AXIOM_5:
		case TOOL_AXIOM_6:
		case TOOL_AXIOM_7:
			if (pressesCount === 0) { return 0; }
			if (pressesCount === 1 && releasesCount === 0) { return 1; }
			if (pressesCount === 1 && releasesCount === 1) { return 2; }
			if (pressesCount === 2 && releasesCount === 1) { return 3; }
			if (pressesCount === 2 && releasesCount === 2) { return 4; }
			if (pressesCount === 3 && releasesCount === 2) { return 5; }
			if (pressesCount === 3 && releasesCount === 3) { return 6; }
			return 7;
		case TOOL_KAWASAKI:
			if (pressesCount === 0) { return 0; }
			if (pressesCount === 1 && releasesCount === 0) { return 1; }
			if (pressesCount === 1 && releasesCount === 1) { return 2; }
			if (pressesCount === 2 && releasesCount === 1) { return 3; }
			if (pressesCount === 2 && releasesCount === 2) { return 4; }
		case TOOL_PLEAT:
			if (pressesCount === 0) { return 0; }
			if (pressesCount === 1 && releasesCount === 0) { return 1; }
			if (pressesCount === 1 && releasesCount === 1) { return 2; }
			if (pressesCount === 2 && releasesCount === 1) { return 3; }
			if (pressesCount === 2 && releasesCount === 2) { return 4; }
		case TOOL_SCRIBBLE: return 0;
		default: return Infinity;
		}
	},
	0,
);
