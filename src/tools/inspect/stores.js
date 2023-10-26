import {
	get,
	writable,
	derived,
} from "svelte/store";
import { nearest } from "rabbit-ear/graph/nearest.js";
import { CreasePattern } from "../../stores/Model.js";
import { Highlight } from "../../stores/UI.js";

export const Press = writable(undefined);
export const Move = writable(undefined);
export const TargetLocked = derived(Press, $Press => $Press !== undefined, false);
export const SingleUpdate = writable(false);
export const Nearest = writable(undefined);
// const Target = writable(undefined);

// const UpdateTarget = derived(
// 	[Press, Move, SingleUpdate],
// 	([$Press, $Move, $SingleUpdate]) => {
// 		if ($SingleUpdate) {
// 			// Target.set($Press ? $Press : $Move);
// 			const target = $Press ? $Press : $Move;
// 			if (target) { Nearest.set(nearest(get(CreasePattern), target)); }
// 			SingleUpdate.set(false);
// 		}
// 		else if (!$Press) {
// 			if ($Move) { Nearest.set(nearest(get(CreasePattern), $Move)); }
// 			// Target.set($Move);
// 		}
// 	},
// 	undefined,
// );

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

// const UpdateTarget = derived(
// 	[Press, Move, SingleUpdate],
// 	([$Press, $Move, $SingleUpdate]) => {
// 		if ($SingleUpdate) {
// 			Target.set($Press ? $Press : $Move);
// 			SingleUpdate.set(false);
// 		}
// 		else if (!$Press) {
// 			Target.set($Move);
// 		}
// 	},
// 	undefined,
// );

// export const Nearest = derived(
// 	[Target, CreasePattern],
// 	([$Target, $CreasePattern]) => $Target
// 		? nearest($CreasePattern, $Target)
// 		: undefined,
// 	{},
// );

export const reset = () => {
	Press.set(undefined);
	Move.set(undefined);
};

let unsub = [];

export const subscribe = () => {
	unsub = [
		// UpdateTarget.subscribe(() => {}),
		UpdateHighlight.subscribe(() => {}),
	];
};

export const unsubscribe = () => {
	unsub.forEach(fn => fn());
	unsub = [];
	reset();
};
