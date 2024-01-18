import {
	writable,
	derived,
} from "svelte/store";
import {
	snapOldToPoint,
} from "../../js/snapOld.js";
import { zipArrays } from "../../js/arrays.js";

export const ScribbleSmooth = writable(true);
export const ScribbleSmoothAmount = writable(0.5);
export const ScribbleDensity = writable(0.5);
export const ScribbleWaitForConfirmation = writable(false);

export const Move = writable(undefined);
export const Press = writable(undefined);
export const Drags = writable([]);
export const Release = writable(undefined);

// export const MoveCoords = derived(
// 	Move,
// 	($Move) => snapOldToPoint($Move),
// 	undefined,
// );

// export const PressCoords = derived(
// 	Press,
// 	($Press) => snapOldToPoint($Press),
// 	undefined,
// );

export const Polyline = derived(
	[Press, Drags, Release],
	([$Press, $Drags, $Release]) => [$Press]
		.concat($Drags)
		.concat([$Release])
		.filter(a => a !== undefined),
	[],
);

// export const PolylineSmooth = derived(
// 	[Polyline, ScribbleSmooth, ScribbleSmoothAmount],
// 	([$Polyline, $ScribbleSmooth, $ScribbleSmoothAmount]) => {
// 	},
// 	[],
// );

export const PolylineSmooth = derived(Polyline, ($Polyline) => $Polyline, []);

export const reset = () => {
	Move.set(undefined);
	Press.set(undefined);
	Drag.set(undefined);
};

let unsub;

export const subscribe = () => {
	unsub = ShiftRulers.subscribe(() => {});
};

export const unsubscribe = () => {
	if (unsub) { unsub(); }
	reset();
};
