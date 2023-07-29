import { get } from "svelte/store";
import { writable } from "svelte/store";
import { autoPlanarize as autoPlanarizeFunc } from "../kernel/prePostEvents.js";
import {
	preExecuteEvents,
	postExecuteEvents,
} from "../kernel/app.js";

export const NewEdgeAssignment = writable("F");
export const Snapping = writable(true);
export const ShowSimulator = writable(false);
export const ShowTerminal = writable(false);
export const ShowGrid = writable(true);
export const ShowAxes = writable(true);
export const RulersAutoClear = writable(true);

const {
	subscribe: autoPlanarizeSubscribe,
	update: autoPlanarizeUpdate,
	set: autoPlanarizeSet,
} = writable(false);

export const AutoPlanarize = {
	subscribe: autoPlanarizeSubscribe,
	update: autoPlanarizeUpdate,
	set: (e) => {
		const events = get(postExecuteEvents)
			.filter(fn => fn !== autoPlanarizeFunc);
		if (e) { events.push(autoPlanarizeFunc); }
		postExecuteEvents.set(events);
		return autoPlanarizeSet(e);
	},
};

AutoPlanarize.set(true);
