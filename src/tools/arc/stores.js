import { boundingBox } from "rabbit-ear/math/polygon.js";
import {
	subtract2,
	distance2,
} from "rabbit-ear/math/vector.js";
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
	SnapPointsCP,
	SnapPointsFolded,
	SnapRadiusCP,
	SnapRadiusFolded,
	RadialSnapDegrees,
	RadialSnapOffset,
} from "../../stores/Snap.js";
import { RulersCP } from "../../stores/Ruler.js";
import { executeCommand } from "../../kernel/execute.js";

export const CPMove = writable(undefined);
export const CPDrag = writable(undefined);
export const CPPresses = writable([]);
export const CPReleases = writable([]);
export const FoldedMove = writable(undefined);
export const FoldedDrag = writable(undefined);
export const FoldedPresses = writable([]);
export const FoldedReleases = writable([]);

export const CPStep = derived(
	[CPPresses, CPReleases],
	([$CPPresses, $CPReleases]) => $CPPresses.length + $CPReleases.length,
	0,
);

const CPMoveSnap = derived(
	[CPMove, CPStep, SnapPointsCP, RulersCP, SnapRadiusCP],
	([$CPMove, $CPStep, $SnapPointsCP, $RulersCP, $SnapRadiusCP]) => ($CPStep < 2
		? snapToPoint($CPMove, $SnapPointsCP, $SnapRadiusCP)
		: snapToRulerLine($CPMove, $SnapPointsCP, $RulersCP, $SnapRadiusCP)
	),
	{ coords: undefined, snap: false },
);

const CPDragSnap = derived(
	[CPDrag, CPStep, SnapPointsCP, RulersCP, SnapRadiusCP],
	([$CPDrag, $CPStep, $SnapPointsCP, $RulersCP, $SnapRadiusCP]) => ($CPStep < 2
		? snapToPoint($CPDrag, $SnapPointsCP, $SnapRadiusCP)
		: snapToRulerLine($CPDrag, $SnapPointsCP, $RulersCP, $SnapRadiusCP)
	),
	{ coords: undefined, snap: false },
);

export const CPMoveCoords = derived(
	CPMoveSnap,
	($CPMoveSnap) => $CPMoveSnap.coords,
	undefined,
);

export const CPDragCoords = derived(
	CPDragSnap,
	($CPDragSnap) => $CPDragSnap.coords,
	undefined,
);

export const CPCircleCenter = derived(
	[CPPresses, SnapPointsCP, SnapRadiusCP],
	([$CPPresses, $SnapPointsCP, $SnapRadiusCP]) => (
		snapToPoint($CPPresses[0], $SnapPointsCP, $SnapRadiusCP).coords
	),
	undefined,
);

export const CPRelease0Coords = derived(
	[CPReleases, SnapPointsCP, SnapRadiusCP],
	([$CPReleases, $SnapPointsCP, $SnapRadiusCP]) => (
		snapToPoint($CPReleases[0], $SnapPointsCP, $SnapRadiusCP).coords
	),
	undefined,
);

// export const CPSegment0 = derived(
// 	[CPPresses, SnapPointsCP, RulersCP, SnapRadiusCP],
// 	([$CPPresses, $SnapPointsCP, $RulersCP, $SnapRadiusCP]) => (
// 		snapToRulerLine($CPPresses[1], $SnapPointsCP, $RulersCP, $SnapRadiusCP).coords
// 	),
// 	undefined,
// );

// export const CPSegment1 = derived(
// 	[CPReleases, SnapPointsCP, RulersCP, SnapRadiusCP],
// 	([$CPReleases, $SnapPointsCP, $RulersCP, $SnapRadiusCP]) => (
// 		snapToRulerLine($CPReleases[1], $SnapPointsCP, $RulersCP, $SnapRadiusCP).coords
// 	),
// 	undefined,
// );

export const CPCircleRadius = derived(
	[CPCircleCenter, CPDragCoords, CPRelease0Coords],
	([$CPCircleCenter, $CPDragCoords, $CPRelease0Coords]) => {
		const start = $CPCircleCenter;
		const end = $CPRelease0Coords ? $CPRelease0Coords : $CPDragCoords;
		return start && end ? distance2(end, start) : 0;
	},
	0,
);

export const CPCircle = derived(
	[CPCircleCenter, CPCircleRadius],
	([$CPCircleCenter, $CPCircleRadius]) => $CPCircleCenter
		? { center: $CPCircleCenter, radius: $CPCircleRadius }
		: undefined,
	undefined,
);



export const CPSetSnapPoint = derived(
	[CPMoveSnap, CPDragSnap],
	([$CPMoveSnap, $CPDragSnap]) => {
		const point = [$CPMoveSnap, $CPDragSnap]
			.filter(a => a !== undefined)
			.filter(el => el.snap)
			.shift();
		SnapPoint.set(point && point.snap ? point.coords : undefined);
	},
	undefined,
);

export const reset = () => {
	CPMove.set(undefined);
	CPDrag.set(undefined);
	CPPresses.set([]);
	CPReleases.set([]);
};

let unsub1;

export const subscribe = () => {
	unsub1 = CPSetSnapPoint.subscribe(() => {});
};

export const unsubscribe = () => {
	if (unsub1) { unsub1(); }
	reset();
};
