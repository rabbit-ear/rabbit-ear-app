import { get } from "svelte/store";
import { writable } from "svelte/store";
import {
	SNAP_NONE,
	SNAP_GRID,
	SNAP_SMART,
} from "../app/keys.js";
import { autoPlanarize as autoPlanarizeFunc } from "../kernel/prePostEvents.js";
import {
	preExecuteEvents,
	postExecuteEvents,
} from "../kernel/app.js";

export const NewEdgeAssignment = writable("U");

export const Snapping = writable(SNAP_SMART);

export const ShowSimulator = writable(false);

export const ShowTerminal = writable(false);

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
