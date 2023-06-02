import { writable } from "svelte/store";
import {
	TOOL_SELECT,
	TOOL_VERTEX,
	SELECT_VERTEX,
	SELECT_EDGE,
	SELECT_FACE,
} from "../js/enums.js";

export const tool = writable(TOOL_VERTEX);

export const selectElement = writable(SELECT_VERTEX);

export const darkMode = writable(true);

// stroke width of the crease edges
export const strokeWidth = writable(0.0025);

// export const viewBox = writable([0, 0, 16, 16]);
export const viewBox = writable([0, 0, 12, 12]);

export const selectionRect = writable(undefined);
