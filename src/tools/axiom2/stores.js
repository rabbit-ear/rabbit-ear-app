import {
	writable,
	derived,
} from "svelte/store";
import {
	snapToPoint,
	snapToRulerLine,
} from "../../js/snap.js";
import {
	execute,
	executeCommand,
} from "../../kernel/execute.js";
import {
	SnapPointsCP,
	SnapPointsFolded,
	SnapRadiusCP,
	SnapRadiusFolded,
	GridSnapFunction,
} from "../../stores/Snap.js";
import {
	SnapPoint,
	GuideLinesCP,
	GuideLinesFolded,
} from "../../stores/UI.js";
import {
	RulersCP,
	RulersFolded,
} from "../../stores/Ruler.js";

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
	[CPMove, CPStep, SnapPointsCP, RulersCP, SnapRadiusCP, GridSnapFunction],
	([$CPMove, $CPStep, $SnapPointsCP, $RulersCP, $SnapRadiusCP, $GridSnapFunction]) => ($CPStep < 2
		? snapToPoint($CPMove, $SnapPointsCP, $SnapRadiusCP, $GridSnapFunction)
		: snapToRulerLine($CPMove, $SnapPointsCP, $RulersCP, $SnapRadiusCP)
	),
	{ coords: undefined, snap: false },
);

const CPDragSnap = derived(
	[CPDrag, CPStep, SnapPointsCP, RulersCP, SnapRadiusCP, GridSnapFunction],
	([$CPDrag, $CPStep, $SnapPointsCP, $RulersCP, $SnapRadiusCP, $GridSnapFunction]) => ($CPStep < 2
		? snapToPoint($CPDrag, $SnapPointsCP, $SnapRadiusCP, $GridSnapFunction)
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

export const CPPress0Coords = derived(
	[CPPresses, SnapPointsCP, SnapRadiusCP, GridSnapFunction],
	([$CPPresses, $SnapPointsCP, $SnapRadiusCP, $GridSnapFunction]) => (
		snapToPoint($CPPresses[0], $SnapPointsCP, $SnapRadiusCP, $GridSnapFunction).coords
	),
	undefined,
);

export const CPRelease0Coords = derived(
	[CPReleases, SnapPointsCP, SnapRadiusCP, GridSnapFunction],
	([$CPReleases, $SnapPointsCP, $SnapRadiusCP, $GridSnapFunction]) => (
		snapToPoint($CPReleases[0], $SnapPointsCP, $SnapRadiusCP, $GridSnapFunction).coords
	),
	undefined,
);

export const CPPress1Coords = derived(
	[CPPresses, SnapPointsCP, RulersCP, SnapRadiusCP],
	([$CPPresses, $SnapPointsCP, $RulersCP, $SnapRadiusCP]) => (
		snapToRulerLine($CPPresses[1], $SnapPointsCP, $RulersCP, $SnapRadiusCP).coords
	),
	undefined,
);

export const CPRelease1Coords = derived(
	[CPReleases, SnapPointsCP, RulersCP, SnapRadiusCP],
	([$CPReleases, $SnapPointsCP, $RulersCP, $SnapRadiusCP]) => (
		snapToRulerLine($CPReleases[1], $SnapPointsCP, $RulersCP, $SnapRadiusCP).coords
	),
	undefined,
);


// ////////////////////////////////


export const FoldedStep = derived(
	[FoldedPresses, FoldedReleases],
	([$FoldedPresses, $FoldedReleases]) => (
		$FoldedPresses.length + $FoldedReleases.length
	),
	0,
);

const FoldedMoveSnap = derived(
	[FoldedMove, FoldedStep, SnapPointsFolded, RulersFolded, SnapRadiusFolded, GridSnapFunction],
	([$FoldedMove, $FoldedStep, $SnapPointsFolded, $RulersFolded, $SnapRadiusFolded, $GridSnapFunction]) => ($FoldedStep < 2
		? snapToPoint($FoldedMove, $SnapPointsFolded, $SnapRadiusFolded, $GridSnapFunction)
		: snapToRulerLine($FoldedMove, $SnapPointsFolded, $RulersFolded, $SnapRadiusFolded)
	),
	{ coords: undefined, snap: false },
);

const FoldedDragSnap = derived(
	[FoldedDrag, FoldedStep, SnapPointsFolded, RulersFolded, SnapRadiusFolded, GridSnapFunction],
	([$FoldedDrag, $FoldedStep, $SnapPointsFolded, $RulersFolded, $SnapRadiusFolded, $GridSnapFunction]) => ($FoldedStep < 2
		? snapToPoint($FoldedDrag, $SnapPointsFolded, $SnapRadiusFolded, $GridSnapFunction)
		: snapToRulerLine($FoldedDrag, $SnapPointsFolded, $RulersFolded, $SnapRadiusFolded)
	),
	{ coords: undefined, snap: false },
);

export const FoldedMoveCoords = derived(
	FoldedMoveSnap,
	($FoldedMoveSnap) => $FoldedMoveSnap.coords,
	undefined,
);

export const FoldedDragCoords = derived(
	FoldedDragSnap,
	($FoldedDragSnap) => $FoldedDragSnap.coords,
	undefined,
);

export const FoldedPress0Coords = derived(
	[FoldedPresses, SnapPointsFolded, SnapRadiusFolded, GridSnapFunction],
	([$FoldedPresses, $SnapPointsFolded, $SnapRadiusFolded, $GridSnapFunction]) => (
		snapToPoint($FoldedPresses[0], $SnapPointsFolded, $SnapRadiusFolded, $GridSnapFunction).coords
	),
	undefined,
);

export const FoldedRelease0Coords = derived(
	[FoldedReleases, SnapPointsFolded, SnapRadiusFolded, GridSnapFunction],
	([$FoldedReleases, $SnapPointsFolded, $SnapRadiusFolded, $GridSnapFunction]) => (
		snapToPoint($FoldedReleases[0], $SnapPointsFolded, $SnapRadiusFolded, $GridSnapFunction).coords
	),
	undefined,
);

export const FoldedPress1Coords = derived(
	[FoldedPresses, SnapPointsFolded, RulersFolded, SnapRadiusFolded],
	([$FoldedPresses, $SnapPointsFolded, $RulersFolded, $SnapRadiusFolded]) => (
		snapToRulerLine($FoldedPresses[1], $SnapPointsFolded, $RulersFolded, $SnapRadiusFolded).coords
	),
	undefined,
);

export const FoldedRelease1Coords = derived(
	[FoldedReleases, SnapPointsFolded, RulersFolded, SnapRadiusFolded],
	([$FoldedReleases, $SnapPointsFolded, $RulersFolded, $SnapRadiusFolded]) => (
		snapToRulerLine($FoldedReleases[1], $SnapPointsFolded, $RulersFolded, $SnapRadiusFolded).coords
	),
	undefined,
);


// ////////////////////////////////

export const RulerSetRequest = writable(false);

export const CPAxiomPreview = derived(
	[CPPress0Coords, CPRelease0Coords, CPDragCoords],
	([$CPPress0Coords, $CPRelease0Coords, $CPDragCoords]) => {
		// console.log("CPAxiomPreview");
		if ($CPPress0Coords && !$CPRelease0Coords && $CPDragCoords) {
			const point1 = $CPPress0Coords.join(", ");
			const point2 = $CPDragCoords.join(", ");
			const args = `[${point1}], [${point2}]`;
			execute(`setGuideLinesCP(axiom2(${args}))`);
		}
	},
	undefined,
);

export const CPAxiomRulers = derived(
	[CPPress0Coords, CPRelease0Coords, RulerSetRequest],
	([$CPPress0Coords, $CPRelease0Coords, $RulerSetRequest]) => {
		if (!$RulerSetRequest) { return; }
		if ($CPPress0Coords && $CPRelease0Coords) {
			const point1 = $CPPress0Coords.join(", ");
			const point2 = $CPRelease0Coords.join(", ");
			const args = `[${point1}], [${point2}]`;
			GuideLinesCP.set([]);
			RulerSetRequest.set(false);
			execute(`setRulersCP(axiom2(${args}))`);
		}
	},
	undefined,
);

export const CPAddSegment = derived(
	[CPPress1Coords, CPRelease1Coords],
	([$CPPress1Coords, $CPRelease1Coords]) => {
		if ($CPPress1Coords && $CPRelease1Coords) {
			executeCommand("segment", [$CPPress1Coords, $CPRelease1Coords]);
			reset();
		}
	},
	undefined,
);

export const FoldedAxiomPreview = derived(
	[FoldedPress0Coords, FoldedRelease0Coords, FoldedDragCoords],
	([$FoldedPress0Coords, $FoldedRelease0Coords, $FoldedDragCoords]) => {
		if ($FoldedPress0Coords && !$FoldedRelease0Coords && $FoldedDragCoords) {
			const point1 = $FoldedPress0Coords.join(", ");
			const point2 = $FoldedDragCoords.join(", ");
			const args = `[${point1}], [${point2}]`;
			execute(`setGuideLinesFolded(axiom2(${args}))`);
		}
	},
	undefined,
);

export const FoldedAxiomRulers = derived(
	[FoldedPress0Coords, FoldedRelease0Coords, RulerSetRequest],
	([$FoldedPress0Coords, $FoldedRelease0Coords, $RulerSetRequest]) => {
		if (!$RulerSetRequest) { return; }
		if ($FoldedPress0Coords && $FoldedRelease0Coords) {
			const point1 = $FoldedPress0Coords.join(", ");
			const point2 = $FoldedRelease0Coords.join(", ");
			const args = `[${point1}], [${point2}]`;
			GuideLinesFolded.set([]);
			RulerSetRequest.set(false);
			execute(`setRulersFolded(axiom2(${args}))`);
		}
	},
	undefined,
);

export const FoldedAddSegment = derived(
	[FoldedPress1Coords, FoldedRelease1Coords],
	([$FoldedPress1Coords, $FoldedRelease1Coords]) => {
		if ($FoldedPress1Coords && $FoldedRelease1Coords) {
			executeCommand("foldedSegment", $FoldedPress1Coords, $FoldedRelease1Coords);
			reset();
		}
	},
	undefined,
);

// ////////////////////////////////

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

export const FoldedSetSnapPoint = derived(
	[FoldedMoveSnap, FoldedDragSnap],
	([$FoldedMoveSnap, $FoldedDragSnap]) => {
		const point = [$FoldedMoveSnap, $FoldedDragSnap]
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
	FoldedMove.set(undefined);
	FoldedDrag.set(undefined);
	FoldedPresses.set([]);
	FoldedReleases.set([]);
	RulersCP.set([]);
	RulersFolded.set([]);
	GuideLinesCP.set([]);
	GuideLinesFolded.set([]);
};

let unsub = [];

export const subscribe = () => {
	unsub = [
		CPAxiomPreview.subscribe(() => {}),
		CPAxiomRulers.subscribe(() => {}),
		CPAddSegment.subscribe(() => {}),
		CPSetSnapPoint.subscribe(() => {}),
		FoldedAxiomPreview.subscribe(() => {}),
		FoldedAxiomRulers.subscribe(() => {}),
		FoldedAddSegment.subscribe(() => {}),
		FoldedSetSnapPoint.subscribe(() => {}),
	];
};

export const unsubscribe = () => {
	unsub.forEach(u => u());
	unsub = [];
	reset();
};
