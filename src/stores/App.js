import { get } from "svelte/store";
import { writable, derived } from "svelte/store";
import { autoPlanarize as autoPlanarizeFunc } from "../kernel/prePostEvents.js";
import {
	preExecuteEvents,
	postExecuteEvents,
} from "../kernel/app.js";
import { ViewBox } from "./ViewBox.js";

// these are immutable. a bit like compiler directives.
// these will only change to target different builds.
export const ShowHeader = true;
export const UndoHistoryLength = 30;

// app preferences and settings
export const NewEdgeAssignment = writable("F");
export const Snapping = writable(true);
export const ShowSimulator = writable(false);
export const ShowTerminal = writable(false);
export const ShowFrames = writable(true);
export const ShowGrid = writable(true);
export const ShowAxes = writable(true);
export const RulersAutoClear = writable(true);

// DOM element references
export const DialogNewFile = writable(undefined);
export const DialogNewFrame = writable(undefined);
export const TerminalTextarea = writable(undefined);
export const TerminalValue = writable(undefined);

// vertex radius is is dynamic according to the zoom level
// this number is a scale of the size of the viewbox.
export const VertexRadiusFactor = writable(0.00666);

// svg circle elements query this for their radius value.
export const VertexRadius = derived(
	[ViewBox, VertexRadiusFactor],
	([$ViewBox, $VertexRadiusFactor]) => (
		Math.max($ViewBox[2], $ViewBox[3]) * $VertexRadiusFactor
	),
	0.00666,
);

// pre- and post- execute() events are managed by the kernel.
// when an operation is finished, it's customary to re-planarize
// the graph to resolve any edge crossings/duplicate vertices.
// an advanced user can disable this feature.
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
