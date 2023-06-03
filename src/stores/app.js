import { writable } from "svelte/store";
import {
	TOOL_SELECT,
	TOOL_VERTEX,
	SELECT_VERTEX,
	SELECT_EDGE,
	SELECT_FACE,
} from "../js/enums.js";

const makeEmptySelected = () => ({ vertices: [], edges: [], faces: [] });

export const tool = writable(TOOL_SELECT);

export const selected = writable(makeEmptySelected());

export const selectionRect = writable(undefined);

const { subscribe, set, update } = writable(SELECT_VERTEX);
// export const selectElement = writable(SELECT_VERTEX);
export const selectElement = {
	subscribe,
	set: (g) => {
		selected.set(makeEmptySelected());
		return set(g);
	},
	reset: () => set(makeEmptySelected()),
};

export const darkMode = writable(true);

export const viewBox = writable([0, 0, 3, 3]);
