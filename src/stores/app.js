import { writable } from "svelte/store";
import {
	TOOL_SELECT,
	TOOL_VERTEX,
	TOOL_EDGE,
	SELECT_VERTEX,
	SELECT_EDGE,
	SELECT_FACE,
} from "../js/enums.js";
import { selected } from "./select.js";

export const darkMode = writable(true);

export const viewBox = writable([0, 0, 3, 3]);

const {
	subscribe: toolSubscribe,
	set: toolSet,
} = writable(TOOL_SELECT);

export const tool = {
	subscribe: toolSubscribe,
	set: (t) => {
		selected.reset();
		// switch (t) {
		// case TOOL_VERTEX: elementSelectSet(SELECT_VERTEX); break;
		// case TOOL_EDGE: elementSelectSet(SELECT_EDGE); break;
		// }
		return toolSet(t);
	},
	reset: () => toolSet(TOOL_SELECT),
};

const {
	subscribe: elementSelectSubscribe,
	set: elementSelectSet,
} = writable(SELECT_VERTEX);

export const elementSelect = {
	subscribe: elementSelectSubscribe,
	set: (e) => {
		selected.reset();
		return elementSelectSet(e);
	},
	reset: () => elementSelectSet(SELECT_VERTEX),
};
