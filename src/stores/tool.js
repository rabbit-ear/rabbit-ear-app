import { writable } from "svelte/store";
import {
	TOOL_SELECT,
	TOOL_VERTEX,
	TOOL_EDGE,
	ASSIGN_SWAP,
	SELECT_EDGE,
} from "../app/keys.js";
import { selection } from "./select.js";
import {
	presses,
	moves,
	releases,
} from "./ui.js";

const { subscribe, set, update } = writable(TOOL_SELECT);

export const tool = {
	subscribe,
	update,
	set: (t) => {
		presses.set([]);
		moves.set([]);
		releases.set([]);
		switch (t) {
		case TOOL_VERTEX: break;
		default:
			selection.reset();
		}
		return set(t);
	},
};

const {
	subscribe: subElementSelect,
	set: setElementSelect,
	update: updateElementSelect,
} = writable(SELECT_EDGE);

export const elementSelect = {
	subscribe: subElementSelect,
	update: updateElementSelect,
	set: (e) => {
		selection.reset();
		return setElementSelect(e);
	},
};

// any modifier or attribute or detail necessary
// for the main tool.
export const assignType = writable(ASSIGN_SWAP);
export const foldAngleValue = writable(90);
