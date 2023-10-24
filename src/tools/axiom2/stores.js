import {
	writable,
	derived,
} from "svelte/store";
import {
	snapToPointNew,
	snapToRulerLineNew,
} from "../../js/snapNew.js";
import {
	snapToPoint,
	snapToPointWithInfo,
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
	[CPMove, CPStep, SnapPointsCP, RulersCP, SnapRadiusCP],
	([$CPMove, $CPStep, $SnapPointsCP, $RulersCP, $SnapRadiusCP]) => ($CPStep < 2
		? snapToPointNew($CPMove, $SnapPointsCP, $SnapRadiusCP)
		: snapToRulerLineNew($CPMove, $SnapPointsCP, $RulersCP, $SnapRadiusCP)
	),
	{ coords: undefined, snap: false },
);

const CPDragSnap = derived(
	[CPDrag, CPStep, SnapPointsCP, RulersCP, SnapRadiusCP],
	([$CPDrag, $CPStep, $SnapPointsCP, $RulersCP, $SnapRadiusCP]) => ($CPStep < 2
		? snapToPointNew($CPDrag, $SnapPointsCP, $SnapRadiusCP)
		: snapToRulerLineNew($CPDrag, $SnapPointsCP, $RulersCP, $SnapRadiusCP)
	),
	{ coords: undefined, snap: false },
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

export const CPCoords0 = derived(
	[CPPresses, SnapPointsCP, SnapRadiusCP],
	([$CPPresses, $SnapPointsCP, $SnapRadiusCP]) => (
		snapToPointNew($CPPresses[0], $SnapPointsCP, $SnapRadiusCP).coords
	),
	undefined,
);

export const CPCoords1 = derived(
	[CPReleases, SnapPointsCP, SnapRadiusCP],
	([$CPReleases, $SnapPointsCP, $SnapRadiusCP]) => (
		snapToPointNew($CPReleases[0], $SnapPointsCP, $SnapRadiusCP).coords
	),
	undefined,
);

export const CPSegment0 = derived(
	[CPPresses, SnapPointsCP, RulersCP, SnapRadiusCP],
	([$CPPresses, $SnapPointsCP, $RulersCP, $SnapRadiusCP]) => (
		snapToRulerLineNew($CPPresses[1], $SnapPointsCP, $RulersCP, $SnapRadiusCP).coords
	),
	undefined,
);

export const CPSegment1 = derived(
	[CPReleases, SnapPointsCP, RulersCP, SnapRadiusCP],
	([$CPReleases, $SnapPointsCP, $RulersCP, $SnapRadiusCP]) => (
		snapToRulerLineNew($CPReleases[1], $SnapPointsCP, $RulersCP, $SnapRadiusCP).coords
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
	[FoldedMove, FoldedStep, SnapPointsFolded, RulersFolded, SnapRadiusFolded],
	([$FoldedMove, $FoldedStep, $SnapPointsFolded, $RulersFolded, $SnapRadiusFolded]) => ($FoldedStep < 2
		? snapToPointNew($FoldedMove, $SnapPointsFolded, $SnapRadiusFolded)
		: snapToRulerLineNew($FoldedMove, $SnapPointsFolded, $RulersFolded, $SnapRadiusFolded)
	),
	{ coords: undefined, snap: false },
);

const FoldedDragSnap = derived(
	[FoldedDrag, FoldedStep, SnapPointsFolded, RulersFolded, SnapRadiusFolded],
	([$FoldedDrag, $FoldedStep, $SnapPointsFolded, $RulersFolded, $SnapRadiusFolded]) => ($FoldedStep < 2
		? snapToPointNew($FoldedDrag, $SnapPointsFolded, $SnapRadiusFolded)
		: snapToRulerLineNew($FoldedDrag, $SnapPointsFolded, $RulersFolded, $SnapRadiusFolded)
	),
	{ coords: undefined, snap: false },
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

export const FoldedCoords0 = derived(
	[FoldedPresses, SnapPointsFolded, SnapRadiusFolded],
	([$FoldedPresses, $SnapPointsFolded, $SnapRadiusFolded]) => (
		snapToPointNew($FoldedPresses[0], $SnapPointsFolded, $SnapRadiusFolded).coords
	),
	undefined,
);

export const FoldedCoords1 = derived(
	[FoldedReleases, SnapPointsFolded, SnapRadiusFolded],
	([$FoldedReleases, $SnapPointsFolded, $SnapRadiusFolded]) => (
		snapToPointNew($FoldedReleases[0], $SnapPointsFolded, $SnapRadiusFolded).coords
	),
	undefined,
);

export const FoldedSegment0 = derived(
	[FoldedPresses, SnapPointsFolded, RulersFolded, SnapRadiusFolded],
	([$FoldedPresses, $SnapPointsFolded, $RulersFolded, $SnapRadiusFolded]) => (
		snapToRulerLineNew($FoldedPresses[1], $SnapPointsFolded, $RulersFolded, $SnapRadiusFolded).coords
	),
	undefined,
);

export const FoldedSegment1 = derived(
	[FoldedReleases, SnapPointsFolded, RulersFolded, SnapRadiusFolded],
	([$FoldedReleases, $SnapPointsFolded, $RulersFolded, $SnapRadiusFolded]) => (
		snapToRulerLineNew($FoldedReleases[1], $SnapPointsFolded, $RulersFolded, $SnapRadiusFolded).coords
	),
	undefined,
);


// ////////////////////////////////

export const RulerSetRequest = writable(false);

export const CPAxiomPreview = derived(
	[CPCoords0, CPCoords1, CPDragCoords],
	([$CPCoords0, $CPCoords1, $CPDragCoords]) => {
		// console.log("CPAxiomPreview");
		if ($CPCoords0 && !$CPCoords1 && $CPDragCoords) {
			const point1 = $CPCoords0.join(", ");
			const point2 = $CPDragCoords.join(", ");
			const args = `[${point1}], [${point2}]`;
			execute(`setGuideLinesCP(axiom2(${args}))`);
		}
	},
	undefined,
);

export const CPAxiomRulers = derived(
	[CPCoords0, CPCoords1, RulerSetRequest],
	([$CPCoords0, $CPCoords1, $RulerSetRequest]) => {
		// console.log("CPAxiomRulers");
		if (!$RulerSetRequest) { return; }
		if ($CPCoords0 && $CPCoords1) {
			const point1 = $CPCoords0.join(", ");
			const point2 = $CPCoords1.join(", ");
			const args = `[${point1}], [${point2}]`;
			GuideLinesCP.set([]);
			RulerSetRequest.set(false);
			execute(`setRulersCP(axiom2(${args}))`);
		}
	},
	undefined,
);

export const CPDoAxiom = derived(
	[CPSegment0, CPSegment1],
	([$CPSegment0, $CPSegment1]) => {
		// console.log("CPDoAxiom");
		if ($CPSegment0 && $CPSegment1) {
			executeCommand("segment", $CPSegment0, $CPSegment1);
			reset();
		}
	},
	undefined,
);


export const FoldedAxiomPreview = derived(
	[FoldedCoords0, FoldedCoords1, FoldedDragCoords],
	([$FoldedCoords0, $FoldedCoords1, $FoldedDragCoords]) => {
		// console.log("FoldedAxiomPreview");
		if ($FoldedCoords0 && !$FoldedCoords1 && $FoldedDragCoords) {
			const point1 = $FoldedCoords0.join(", ");
			const point2 = $FoldedDragCoords.join(", ");
			const args = `[${point1}], [${point2}]`;
			execute(`setGuideLinesFolded(axiom2(${args}))`);
		}
	},
	undefined,
);

export const FoldedAxiomRulers = derived(
	[FoldedCoords0, FoldedCoords1, RulerSetRequest],
	([$FoldedCoords0, $FoldedCoords1, $RulerSetRequest]) => {
		// console.log("FoldedAxiomRulers");
		if (!$RulerSetRequest) { return; }
		if ($FoldedCoords0 && $FoldedCoords1) {
			const point1 = $FoldedCoords0.join(", ");
			const point2 = $FoldedCoords1.join(", ");
			const args = `[${point1}], [${point2}]`;
			GuideLinesFolded.set([]);
			RulerSetRequest.set(false);
			execute(`setRulersFolded(axiom2(${args}))`);
		}
	},
	undefined,
);

export const FoldedDoAxiom = derived(
	[FoldedSegment0, FoldedSegment1],
	([$FoldedSegment0, $FoldedSegment1]) => {
		// console.log("FoldedDoAxiom");
		if ($FoldedSegment0 && $FoldedSegment1) {
			executeCommand("foldedSegment", $FoldedSegment0, $FoldedSegment1);
			reset();
		}
	},
	undefined,
);

export const reset = () => {
	// console.log("axiom2 reset");
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
		CPDoAxiom.subscribe(() => {}),
		CPSetSnapPoint.subscribe(() => {}),
		FoldedAxiomPreview.subscribe(() => {}),
		FoldedAxiomRulers.subscribe(() => {}),
		FoldedDoAxiom.subscribe(() => {}),
		FoldedSetSnapPoint.subscribe(() => {}),
	];
};

export const unsubscribe = () => {
	// console.log("axiom2 unsubscribe");
	unsub.forEach(u => u());
	reset();
};
