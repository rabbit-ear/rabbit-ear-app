import { get } from "svelte/store";
import { writable } from "svelte/store";
import {
	TOOL_SELECT,
	TOOL_VERTEX,
	TOOL_EDGE,
	SELECT_VERTEX,
	SELECT_EDGE,
	SELECT_FACE,
	ASSIGN_SWAP,
} from "../app/keys.js";
import { selected } from "./select.js";
import { autoPlanarize as autoPlanarizeFunc } from "../kernel/prePostEvents.js";
import {
	preExecuteEvents,
	postExecuteEvents,
} from "../kernel/app.js";

export const darkMode = writable(true);

export const snapping = writable(false);

const {
	subscribe: viewBoxSubscribe,
	set: viewBoxSet,
} = writable([0, 0, 1, 1]);

export const viewBox = {
	subscribe: viewBoxSubscribe,
	set: viewBoxSet,
	setWidth: (n) => {
		let box = get(viewBox);
		box[2] = n;
		return viewBoxSet([...box]);
	},
	setHeight: (n) => {
		let box = get(viewBox);
		box[3] = n;
		return viewBoxSet([...box]);
	},
};

const {
	subscribe: autoPlanarizeSubscribe,
	set: autoPlanarizeSet,
} = writable(false);

export const autoPlanarize = {
	subscribe: autoPlanarizeSubscribe,
	set: (e) => {
		const events = get(postExecuteEvents)
			.filter(fn => fn !== autoPlanarizeFunc);
		if (e) { events.push(autoPlanarizeFunc); }
		postExecuteEvents.set(events);
		return autoPlanarizeSet(e);
	},
};

autoPlanarize.set(true);

// this is the "main tool" selection

const {
	subscribe: toolSubscribe,
	set: toolSet,
} = writable(TOOL_SELECT);

export const tool = {
	subscribe: toolSubscribe,
	set: (t) => {
		// selected.reset();
		// switch (t) { case TOOL_VERTEX: break; }
		return toolSet(t);
	},
	reset: () => toolSet(TOOL_SELECT),
};

// any modifier or attribute or detail necessary
// for the main tool.

const {
	subscribe: elementSelectSubscribe,
	set: elementSelectSet,
} = writable(SELECT_EDGE);

export const elementSelect = {
	subscribe: elementSelectSubscribe,
	set: (e) => {
		selected.reset();
		return elementSelectSet(e);
	},
};

export const assignType = writable(ASSIGN_SWAP);

export const foldAngleValue = writable(90);
