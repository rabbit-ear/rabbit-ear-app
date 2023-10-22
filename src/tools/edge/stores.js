import {
	writable,
	derived,
} from "svelte/store";
import {
	snapToPointNew,
	snapToRulerLineNew,
} from "../../js/snapNew.js";
import {
	Keyboard,
	SnapPoint,
} from "../../stores/UI.js";
import {
	RadialSnapDegrees,
	RadialSnapOffset,
	SnapPointsCP,
	SnapPointsFolded,
	SnapRadiusCP,
	SnapRadiusFolded,
} from "../../stores/Snap.js";
import {
	RulersCP,
	RulersFolded,
} from "../../stores/Ruler.js";
import {
	CreasePattern,
	FoldedForm,
	UpdateFrame,
} from "../../stores/Model.js";
import { executeCommand } from "../../kernel/execute.js";

export const CPMove = writable(undefined);
export const CPDrag = writable(undefined);
export const CPPress = writable(undefined);
export const CPRelease = writable(undefined);
export const FoldedMove = writable(undefined);
export const FoldedDrag = writable(undefined);
export const FoldedPress = writable(undefined);
export const FoldedRelease = writable(undefined);

const ShiftLock = derived(Keyboard, $Keyboard => $Keyboard[16], false);

const CPMoveSnap = derived(
	[CPMove, SnapPointsCP, SnapRadiusCP],
	([$CPMove, $SnapPointsCP, $SnapRadiusCP]) => (
		snapToPointNew($CPMove, $SnapPointsCP, $SnapRadiusCP)
	),
	{ coords: undefined, snap: false },
);

export const CPMoveCoords = derived(
	CPMoveSnap,
	$CPMoveSnap => $CPMoveSnap.coords,
	undefined,
);

const CPDragSnap = derived(
	[CPDrag, SnapPointsCP, SnapRadiusCP],
	([$CPDrag, $SnapPointsCP, $SnapRadiusCP]) => (
		snapToPointNew($CPDrag, $SnapPointsCP, $SnapRadiusCP)
	),
	{ coords: undefined, snap: false },
);

export const CPDragCoords = derived(
	[ShiftLock, CPDrag, SnapPointsCP, RulersCP, SnapRadiusCP],
	([$ShiftLock, $CPDrag, $SnapPointsCP, $RulersCP, $SnapRadiusCP]) => $ShiftLock
		? snapToRulerLineNew($CPDrag, $SnapPointsCP, $RulersCP, $SnapRadiusCP).coords
		: snapToPointNew($CPDrag, $SnapPointsCP, $SnapRadiusCP).coords,
	undefined,
);

export const CPPressCoords = derived(
	[CPPress, SnapPointsCP, SnapRadiusCP],
	([$CPPress, $SnapPointsCP, $SnapRadiusCP]) => (
		snapToPointNew($CPPress, $SnapPointsCP, $SnapRadiusCP).coords
	),
	undefined,
);

export const CPReleaseCoords = derived(
	[ShiftLock, CPRelease, SnapPointsCP, RulersCP, SnapRadiusCP],
	([$ShiftLock, $CPRelease, $SnapPointsCP, $RulersCP, $SnapRadiusCP]) => $ShiftLock
		? snapToRulerLineNew($CPRelease, $SnapPointsCP, $RulersCP, $SnapRadiusCP).coords
		: snapToPointNew($CPRelease, $SnapPointsCP, $SnapRadiusCP).coords,
	undefined,
);

///////////////////////////////

const FoldedMoveSnap = derived(
	[FoldedMove, SnapPointsFolded, SnapRadiusFolded],
	([$FoldedMove, $SnapPointsFolded, $SnapRadiusFolded]) => (
		snapToPointNew($FoldedMove, $SnapPointsFolded, $SnapRadiusFolded)
	),
	{ coords: undefined, snap: false },
);

export const FoldedMoveCoords = derived(
	FoldedMoveSnap,
	$FoldedMoveSnap => $FoldedMoveSnap.coords,
	undefined,
);

const FoldedDragSnap = derived(
	[FoldedDrag, SnapPointsFolded, SnapRadiusFolded],
	([$FoldedDrag, $SnapPointsFolded, $SnapRadiusFolded]) => (
		snapToPointNew($FoldedDrag, $SnapPointsFolded, $SnapRadiusFolded)
	),
	{ coords: undefined, snap: false },
);

export const FoldedDragCoords = derived(
	[ShiftLock, FoldedDrag, FoldedDragSnap, SnapPointsFolded, RulersFolded, SnapRadiusFolded],
	([$ShiftLock, $FoldedDrag, $FoldedDragSnap, $SnapPointsFolded, $RulersFolded, $SnapRadiusFolded]) => $ShiftLock
		// ? snapToRulerLine($FoldedDrag).coords
		? snapToRulerLineNew($FoldedDrag, $SnapPointsFolded, $RulersFolded, $SnapRadiusFolded).coords
		: $FoldedDragSnap.coords,
	undefined,
);

export const FoldedPressCoords = derived(
	[FoldedPress, SnapPointsFolded, SnapRadiusFolded],
	([$FoldedPress, $SnapPointsFolded, $SnapRadiusFolded]) => (
		snapToPointNew($FoldedPress, $SnapPointsFolded, $SnapRadiusFolded).coords
	),
	undefined,
);

export const FoldedReleaseCoords = derived(
	[ShiftLock, FoldedRelease, SnapPointsFolded, RulersFolded, SnapRadiusFolded],
	([$ShiftLock, $FoldedRelease, $SnapPointsFolded, $RulersFolded, $SnapRadiusFolded]) => $ShiftLock
		? snapToRulerLineNew($FoldedRelease, $SnapPointsFolded, $RulersFolded, $SnapRadiusFolded).coords
		: snapToPointNew($FoldedRelease, $SnapPointsFolded, $SnapRadiusFolded).coords,
	undefined,
);

/**
 * There is a circular relationship between:
 * - setting Rulers, the location of which is based on CPPress
 * - setting CPPress, the location of which is based on Rulers.
 * RulerSetRequest is set by the Keyboard event handler,
 * ensuring that ShiftRulers only fires once.
 */
export const RulerSetRequest = writable(false);

export const ShiftRulers = derived(
	[ShiftLock, CPPressCoords, RadialSnapDegrees, RadialSnapOffset, RulerSetRequest],
	([$ShiftLock, $CPPressCoords, $RadialSnapDegrees, $RadialSnapOffset, $RulerSetRequest]) => {
		if ($ShiftLock && $CPPressCoords && $RulerSetRequest) {
			executeCommand("radialRulers",
				$CPPressCoords,
				$RadialSnapDegrees,
				$RadialSnapOffset,
			);
			RulerSetRequest.set(false);
		}
	},
	undefined,
);

const CPFinishTool = derived(
	[CPPressCoords, CPReleaseCoords],
	([$CPPressCoords, $CPReleaseCoords]) => {
		if (!$CPPressCoords || !$CPReleaseCoords) { return; }
		executeCommand("segment", $CPPressCoords, $CPReleaseCoords);
		reset();
	},
	undefined,
);

const FoldedFinishTool = derived(
	[FoldedPressCoords, FoldedReleaseCoords],
	([$FoldedPressCoords, $FoldedReleaseCoords]) => {
		if (!$FoldedPressCoords || !$FoldedReleaseCoords) { return; }
		executeCommand("foldedSegment", $FoldedPressCoords, $FoldedReleaseCoords);
		reset();
	},
	undefined,
);

const SetSnapPoint = derived(
	[CPMoveSnap, CPDragSnap],
	([$CPMoveSnap, $CPDragSnap]) => {
		const point = [$CPMoveSnap, $CPDragSnap]
			.filter(a => a !== undefined)
			.shift();
		SnapPoint.set(point.snap ? point.coords : undefined);
	},
	undefined,
);

export const reset = () => {
	CPMove.set(undefined);
	CPPress.set(undefined);
	CPDrag.set(undefined);
	CPRelease.set(undefined);
	FoldedMove.set(undefined);
	FoldedPress.set(undefined);
	FoldedDrag.set(undefined);
	FoldedRelease.set(undefined);
};

let unsubs = [];

export const subscribe = () => {
	unsubs = [
		ShiftRulers.subscribe(() => {}),
		SetSnapPoint.subscribe(() => {}),
		CPFinishTool.subscribe(() => {}),
		FoldedFinishTool.subscribe(() => {}),
	];
};

export const unsubscribe = () => {
	unsubs.forEach(fn => fn());
	unsubs = [];
	reset();
};
