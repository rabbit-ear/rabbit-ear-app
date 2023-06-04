import { writable } from "svelte/store";
import {
	TOOL_SELECT,
	TOOL_VERTEX,
	SELECT_VERTEX,
	SELECT_EDGE,
	SELECT_FACE,
} from "../js/enums.js";

export const emptySelectObject = () => ({ vertices: [], edges: [], faces: [] });

const {
	subscribe: subscribeTool,
	set: setTool,
} = writable(TOOL_SELECT);
// export const tool = writable(TOOL_SELECT);
export const tool = {
	subscribe: subscribeTool,
	set: (g) => {
		selected.set(emptySelectObject());
		return setTool(g);
	},
	reset: () => setTool(TOOL_SELECT),
};

const {
	subscribe: subscribeSelected,
	set: setSelected,
} = writable(emptySelectObject());
// export const selected = writable(emptySelectObject());
export const selected = {
	subscribe: subscribeSelected,
	set: (g) => setSelected(g),
	reset: () => setSelected(emptySelectObject()),
};

export const selectionRect = writable(undefined);

const {
	subscribe: subscribeSelectElement,
	set: setSelectElement,
} = writable(SELECT_VERTEX);
// export const selectElement = writable(SELECT_VERTEX);
export const selectElement = {
	subscribe: subscribeSelectElement,
	set: (g) => {
		selected.set(emptySelectObject());
		return setSelectElement(g);
	},
	reset: () => setSelectElement(SELECT_VERTEX),
};

export const darkMode = writable(true);

export const viewBox = writable([0, 0, 3, 3]);
