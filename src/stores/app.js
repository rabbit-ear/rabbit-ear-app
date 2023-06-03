import { writable } from "svelte/store";
import {
	TOOL_SELECT,
	TOOL_VERTEX,
	SELECT_VERTEX,
	SELECT_EDGE,
	SELECT_FACE,
} from "../js/enums.js";

export const tool = writable(TOOL_SELECT);

export const selectElement = writable(SELECT_VERTEX);

export const darkMode = writable(true);

export const viewBox = writable([0, 0, 3, 3]);

export const selectionRect = writable(undefined);

export const selected = writable({
	vertices: [],
	edges: [],
	faces: [],
});
