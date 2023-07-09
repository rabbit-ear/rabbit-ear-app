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

export const darkMode = writable(true);

export const snapping = writable(SNAP_SMART);

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
