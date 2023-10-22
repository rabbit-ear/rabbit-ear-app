import {
	get,
	writable,
	derived,
} from "svelte/store";
import {
	snapToPoint,
	snapToPointWithInfo,
	snapToRulerLine,
} from "../../js/snap.js";
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
import { RulersCP } from "../../stores/Ruler.js";
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

const CPMoveSnap = derived(
	CPMove,
	$CPMove => snapToPointWithInfo($CPMove),
	{ coords: undefined, snap: false },
);

export const CPMoveCoords = derived(
	CPMoveSnap,
	$CPMoveSnap => $CPMoveSnap.coords,
	undefined,
);

const CPDragSnap = derived(
	CPDrag,
	$CPDrag => snapToPointWithInfo($CPDrag),
	{ coords: undefined, snap: false },
);

export const CPDragCoords = derived(
	[Keyboard, CPDrag, SnapPointsCP, RulersCP, SnapRadiusCP],
	([$Keyboard, $CPDrag, $SnapPointsCP, $RulersCP, $SnapRadiusCP]) => $Keyboard[16] // shift key
		? snapToRulerLineNew($CPDrag, $SnapPointsCP, $RulersCP, $SnapRadiusCP).coords
		: snapToPoint($CPDrag),
	undefined,
);

export const CPPressCoords = derived(
	CPPress,
	($CPPress) => snapToPoint($CPPress),
	undefined,
);

export const CPReleaseCoords = derived(
	[Keyboard, CPRelease],
	([$Keyboard, $CPRelease]) => $Keyboard[16] // shift key
		? snapToRulerLine($CPRelease).coords
		: snapToPoint($CPRelease),
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
	[Keyboard, FoldedDrag, FoldedDragSnap],
	([$Keyboard, $FoldedDrag, $FoldedDragSnap]) => $Keyboard[16] // shift key
		? snapToRulerLine($FoldedDrag).coords
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
	[Keyboard, FoldedRelease, SnapPointsFolded, SnapRadiusFolded],
	([$Keyboard, $FoldedRelease, $SnapPointsFolded, $SnapRadiusFolded]) => $Keyboard[16] // shift key
		? snapToRulerLine($FoldedRelease).coords
		: snapToPointNew($FoldedRelease, $SnapPointsFolded, $SnapRadiusFolded).coords,
	undefined,
);

////////////////////////

export const ShiftRulers = derived(
	[Keyboard, CPPressCoords, RadialSnapDegrees, RadialSnapOffset],
	([$Keyboard, $CPPressCoords, $RadialSnapDegrees, $RadialSnapOffset]) => {
		if ($Keyboard[16] && $CPPressCoords) {
			executeCommand("radialRulers",
				$CPPressCoords,
				$RadialSnapDegrees,
				$RadialSnapOffset,
			)
		} else {
			RulersCP.set([]);
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
