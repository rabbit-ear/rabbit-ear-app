import {
	get,
	writable,
	derived,
} from "svelte/store";
import { nearest } from "rabbit-ear/graph/nearest.js";
import { CreasePattern } from "../../stores/ModelCP.js";
import { Highlight } from "../../stores/UI.js";

export const Press = writable(undefined);
export const TargetLocked = derived(Press, $Press => $Press !== undefined, false);
export const Nearest = writable(undefined);

export const UpdateTarget = (point) => {
	if (!point) { return; }
	Nearest.set(structuredClone(nearest(get(CreasePattern), point)));
};

const UpdateHighlight = derived(
	[Nearest],
	([$Nearest]) => {
		Highlight.reset();
		if (!$Nearest) { return; }
		Highlight.set({
			vertices: [$Nearest.vertex].filter(a => a !== undefined),
			edges: [$Nearest.edge].filter(a => a !== undefined),
			faces: [$Nearest.face].filter(a => a !== undefined),
		});
	},
	undefined,
);

export const reset = () => {
	Press.set(undefined);
};

let unsub = [];

export const subscribe = () => {
	unsub = [
		UpdateHighlight.subscribe(() => {}),
	];
};

export const unsubscribe = () => {
	unsub.forEach(fn => fn());
	unsub = [];
	reset();
};
