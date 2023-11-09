import {
	writable,
	derived,
} from "svelte/store";
import {
	snapToPoint,
	snapToRulerLine,
} from "../../js/snap.js";
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
	GridSnapFunction,
} from "../../stores/Snap.js";
import {
	RulersCP,
	RulersFolded,
	RadialRays,
} from "../../stores/Ruler.js";
import { executeCommand } from "../../kernel/execute.js";

// bug:
// hold shift draw a segment don't release shift after finishing,
// rulers are still originating from previous segment.
// new segment rulers don't move to new origin

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
	[CPMove, SnapPointsCP, SnapRadiusCP, GridSnapFunction],
	([$CPMove, $SnapPointsCP, $SnapRadiusCP, $GridSnapFunction]) => (
		snapToPoint($CPMove, $SnapPointsCP, $SnapRadiusCP, $GridSnapFunction)
	),
	{ coords: undefined, snap: false },
);

export const CPMoveCoords = derived(
	CPMoveSnap,
	$CPMoveSnap => $CPMoveSnap.coords,
	undefined,
);

const CPDragSnap = derived(
	[CPDrag, SnapPointsCP, SnapRadiusCP, GridSnapFunction],
	([$CPDrag, $SnapPointsCP, $SnapRadiusCP, $GridSnapFunction]) => (
		snapToPoint($CPDrag, $SnapPointsCP, $SnapRadiusCP, $GridSnapFunction)
	),
	{ coords: undefined, snap: false },
);

export const CPDragCoords = derived(
	[ShiftLock, CPDrag, SnapPointsCP, RulersCP, SnapRadiusCP, GridSnapFunction],
	([$ShiftLock, $CPDrag, $SnapPointsCP, $RulersCP, $SnapRadiusCP, $GridSnapFunction]) => $ShiftLock
		? snapToRulerLine($CPDrag, $SnapPointsCP, $RulersCP, $SnapRadiusCP).coords
		: snapToPoint($CPDrag, $SnapPointsCP, $SnapRadiusCP, $GridSnapFunction).coords,
	undefined,
);

export const CPPressCoords = derived(
	[CPPress, SnapPointsCP, SnapRadiusCP, GridSnapFunction],
	([$CPPress, $SnapPointsCP, $SnapRadiusCP, $GridSnapFunction]) => (
		snapToPoint($CPPress, $SnapPointsCP, $SnapRadiusCP, $GridSnapFunction).coords
	),
	undefined,
);

export const CPReleaseCoords = derived(
	[ShiftLock, CPRelease, SnapPointsCP, RulersCP, SnapRadiusCP, GridSnapFunction],
	([$ShiftLock, $CPRelease, $SnapPointsCP, $RulersCP, $SnapRadiusCP, $GridSnapFunction]) => $ShiftLock
		? snapToRulerLine($CPRelease, $SnapPointsCP, $RulersCP, $SnapRadiusCP).coords
		: snapToPoint($CPRelease, $SnapPointsCP, $SnapRadiusCP, $GridSnapFunction).coords,
	undefined,
);

///////////////////////////////

const FoldedMoveSnap = derived(
	[FoldedMove, SnapPointsFolded, SnapRadiusFolded, GridSnapFunction],
	([$FoldedMove, $SnapPointsFolded, $SnapRadiusFolded, $GridSnapFunction]) => (
		snapToPoint($FoldedMove, $SnapPointsFolded, $SnapRadiusFolded, $GridSnapFunction)
	),
	{ coords: undefined, snap: false },
);

export const FoldedMoveCoords = derived(
	FoldedMoveSnap,
	$FoldedMoveSnap => $FoldedMoveSnap.coords,
	undefined,
);

const FoldedDragSnap = derived(
	[FoldedDrag, SnapPointsFolded, SnapRadiusFolded, GridSnapFunction],
	([$FoldedDrag, $SnapPointsFolded, $SnapRadiusFolded, $GridSnapFunction]) => (
		snapToPoint($FoldedDrag, $SnapPointsFolded, $SnapRadiusFolded, $GridSnapFunction)
	),
	{ coords: undefined, snap: false },
);

export const FoldedDragCoords = derived(
	[ShiftLock, FoldedDrag, FoldedDragSnap, SnapPointsFolded, RulersFolded, SnapRadiusFolded],
	([$ShiftLock, $FoldedDrag, $FoldedDragSnap, $SnapPointsFolded, $RulersFolded, $SnapRadiusFolded]) => $ShiftLock
		// ? snapOldToRulerLine($FoldedDrag).coords
		? snapToRulerLine($FoldedDrag, $SnapPointsFolded, $RulersFolded, $SnapRadiusFolded).coords
		: $FoldedDragSnap.coords,
	undefined,
);

export const FoldedPressCoords = derived(
	[FoldedPress, SnapPointsFolded, SnapRadiusFolded, GridSnapFunction],
	([$FoldedPress, $SnapPointsFolded, $SnapRadiusFolded, $GridSnapFunction]) => (
		snapToPoint($FoldedPress, $SnapPointsFolded, $SnapRadiusFolded, $GridSnapFunction).coords
	),
	undefined,
);

export const FoldedReleaseCoords = derived(
	[ShiftLock, FoldedRelease, SnapPointsFolded, RulersFolded, SnapRadiusFolded, GridSnapFunction],
	([$ShiftLock, $FoldedRelease, $SnapPointsFolded, $RulersFolded, $SnapRadiusFolded, $GridSnapFunction]) => $ShiftLock
		? snapToRulerLine($FoldedRelease, $SnapPointsFolded, $RulersFolded, $SnapRadiusFolded).coords
		: snapToPoint($FoldedRelease, $SnapPointsFolded, $SnapRadiusFolded, $GridSnapFunction).coords,
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
	[ShiftLock, RulerSetRequest, CPPressCoords, FoldedPressCoords, RadialSnapDegrees, RadialSnapOffset],
	([$ShiftLock, $RulerSetRequest, $CPPressCoords, $FoldedPressCoords, $RadialSnapDegrees, $RadialSnapOffset]) => {
		if (!$ShiftLock || !$RulerSetRequest) { return; }
		if ($CPPressCoords) {
			RulersCP.set(RadialRays(
				$CPPressCoords,
				$RadialSnapDegrees,
				$RadialSnapOffset));
			RulerSetRequest.set(false);
		}
		if ($FoldedPressCoords) {
			RulersFolded.set(RadialRays(
				$FoldedPressCoords,
				$RadialSnapDegrees,
				$RadialSnapOffset));
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

const WatchForErrors = derived(
	[CPPress, CPRelease],
	([$CPPress, $CPRelease]) => {
		if ($CPPress === undefined && $CPRelease !== undefined) {
			reset();
		}
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
		WatchForErrors.subscribe(() => {}),
	];
};

export const unsubscribe = () => {
	unsubs.forEach(fn => fn());
	unsubs = [];
	reset();
};
