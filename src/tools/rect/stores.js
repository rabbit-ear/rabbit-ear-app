import { boundingBox } from "rabbit-ear/math/polygon.js";
import {
	writable,
	derived,
} from "svelte/store";
import {
	snapToPoint,
	snapToPointWithInfo,
	snapToRulerLine,
} from "../../js/snap.js";
import {
	Keyboard,
	SnapPoint,
} from "../../stores/UI.js";
import {
	RadialSnapDegrees,
	RadialSnapOffset,
} from "../../stores/Snap.js";
import {
	RulerLines,
	RulerRays,
} from "../../stores/Ruler.js";
import { executeCommand } from "../../kernel/execute.js";

export const Move = writable(undefined);
export const Press = writable(undefined);
export const Drag = writable(undefined);
export const Release = writable(undefined);

const MoveSnap = derived(
	Move,
	$Move => snapToPointWithInfo($Move),
	{ coords: undefined, snap: false },
);

const DragSnap = derived(
	Drag,
	$Drag => snapToPointWithInfo($Drag),
	{ coords: undefined, snap: false },
);

export const MoveCoords = derived(
	MoveSnap,
	$MoveSnap => $MoveSnap.coords,
	undefined,
);

export const PressCoords = derived(
	Press,
	($Press) => snapToPoint($Press),
	undefined,
);

export const DragCoords = derived(
	[Keyboard, Drag],
	([$Keyboard, $Drag]) => $Keyboard[16] // shift key
		? snapToRulerLine($Drag).coords
		: snapToPoint($Drag),
	undefined,
);

export const SetSnapPoint = derived(
	[MoveSnap, DragSnap],
	([$MoveSnap, $DragSnap]) => {
		const point = [$MoveSnap, $DragSnap]
			.filter(a => a !== undefined)
			.shift();
		SnapPoint.set(point.snap ? point.coords : undefined);
	},
	undefined,
);

export const DrawRect = derived(
	[PressCoords, DragCoords, Release],
	([$PressCoords, $DragCoords, $Release]) => boundingBox([$PressCoords, $DragCoords, $Release]
		.filter(a => a !== undefined)),
	undefined,
);

export const reset = () => {
	Move.set(undefined);
	Press.set(undefined);
	Drag.set(undefined);
};

let unsub1;

export const subscribe = () => {
	unsub1 = SetSnapPoint.subscribe(() => {});
};

export const unsubscribe = () => {
	if (unsub1) { unsub1(); }
	reset();
};
