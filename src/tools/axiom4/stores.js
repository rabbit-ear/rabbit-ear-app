import {
	writable,
	derived,
} from "svelte/store";
import {
	zipArrays,
} from "../../js/arrays.js";
import {
	snapToPoint,
	snapToEdge,
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
	Highlight,
} from "../../stores/UI.js";
import {
	RulersCP,
	RulersFolded,
} from "../../stores/Ruler.js";
import { CreasePattern } from "../../stores/ModelCP.js";
import { FoldedForm } from "../../stores/ModelFolded.js";

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
	([$CPMove, $CPStep, $SnapPointsCP, $RulersCP, $SnapRadiusCP]) => {
		switch ($CPStep) {
		case 0: return {};
		case 1: return snapToPoint($CPMove, $SnapPointsCP, $SnapRadiusCP);
		default: return snapToRulerLine($CPMove, $SnapPointsCP, $RulersCP, $SnapRadiusCP);
		}
	},
	{ coords: undefined, snap: false },
);

const CPDragSnap = derived(
	[CPDrag, CPStep, SnapPointsCP, RulersCP, SnapRadiusCP],
	([$CPDrag, $CPStep, $SnapPointsCP, $RulersCP, $SnapRadiusCP]) => {
		switch ($CPStep) {
		case 0: return {};
		case 1: return snapToPoint($CPDrag, $SnapPointsCP, $SnapRadiusCP);
		default: return snapToRulerLine($CPDrag, $SnapPointsCP, $RulersCP, $SnapRadiusCP);
		}
	},
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

export const CPEdge0 = derived(
	[CPPresses, CPMove, CreasePattern],
	([$CPPresses, $CPMove, $CreasePattern]) => snapToEdge(
		[$CPPresses[0], $CPMove].filter(a => a !== undefined).shift(),
		$CreasePattern,
		Infinity,
	).edge,
	undefined,
);

export const CPRelease0Coords = derived(
	[CPReleases, SnapPointsCP, SnapRadiusCP],
	([$CPReleases, $SnapPointsCP, $SnapRadiusCP]) => (
		snapToPoint($CPReleases[0], $SnapPointsCP, $SnapRadiusCP).coords
	),
	undefined,
);

export const CPPress1Coords = derived(
	[CPPresses, SnapPointsCP, RulersCP, SnapRadiusCP],
	([$CPPresses, $SnapPointsCP, $RulersCP, $SnapRadiusCP]) => (
		snapToRulerLine(
			$CPPresses[1],
			$SnapPointsCP,
			$RulersCP,
			$SnapRadiusCP).coords
	),
	undefined,
);

export const CPRelease1Coords = derived(
	[CPReleases, SnapPointsCP, RulersCP, SnapRadiusCP],
	([$CPReleases, $SnapPointsCP, $RulersCP, $SnapRadiusCP]) => (
		snapToRulerLine(
			$CPReleases[1],
			$SnapPointsCP,
			$RulersCP,
			$SnapRadiusCP).coords
	),
	undefined,
);

// //////////////////////////////////////

export const FoldedStep = derived(
	[FoldedPresses, FoldedReleases],
	([$FoldedPresses, $FoldedReleases]) => $FoldedPresses.length + $FoldedReleases.length,
	0,
);

const FoldedMoveSnap = derived(
	[FoldedMove, FoldedStep, SnapPointsFolded, RulersFolded, SnapRadiusFolded],
	([$FoldedMove, $FoldedStep, $SnapPointsFolded, $RulersFolded, $SnapRadiusFolded]) => {
		switch ($FoldedStep) {
		case 0: return {};
		case 1: return snapToPoint($FoldedMove, $SnapPointsFolded, $SnapRadiusFolded);
		default: return snapToRulerLine($FoldedMove, $SnapPointsFolded, $RulersFolded, $SnapRadiusFolded);
		}
	},
	{ coords: undefined, snap: false },
);

const FoldedDragSnap = derived(
	[FoldedDrag, FoldedStep, SnapPointsFolded, RulersFolded, SnapRadiusFolded],
	([$FoldedDrag, $FoldedStep, $SnapPointsFolded, $RulersFolded, $SnapRadiusFolded]) => {
		switch ($FoldedStep) {
		case 0: return {};
		case 1: return snapToPoint($FoldedDrag, $SnapPointsFolded, $SnapRadiusFolded);
		default: return snapToRulerLine($FoldedDrag, $SnapPointsFolded, $RulersFolded, $SnapRadiusFolded);
		}
	},
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

export const FoldedEdge0 = derived(
	[FoldedPresses, FoldedMove, FoldedForm],
	([$FoldedPresses, $FoldedMove, $FoldedForm]) => snapToEdge(
		[$FoldedPresses[0], $FoldedMove].filter(a => a !== undefined).shift(),
		$FoldedForm,
		Infinity,
	).edge,
	undefined,
);

export const FoldedRelease0Coords = derived(
	[FoldedReleases, SnapPointsFolded, SnapRadiusFolded],
	([$FoldedReleases, $SnapPointsFolded, $SnapRadiusFolded]) => (
		snapToPoint($FoldedReleases[0], $SnapPointsFolded, $SnapRadiusFolded).coords
	),
	undefined,
);

export const FoldedPress1Coords = derived(
	[FoldedPresses, SnapPointsFolded, RulersFolded, SnapRadiusFolded],
	([$FoldedPresses, $SnapPointsFolded, $RulersFolded, $SnapRadiusFolded]) => (
		snapToRulerLine(
			$FoldedPresses[1],
			$SnapPointsFolded,
			$RulersFolded,
			$SnapRadiusFolded).coords
	),
	undefined,
);

export const FoldedRelease1Coords = derived(
	[FoldedReleases, SnapPointsFolded, RulersFolded, SnapRadiusFolded],
	([$FoldedReleases, $SnapPointsFolded, $RulersFolded, $SnapRadiusFolded]) => (
		snapToRulerLine(
			$FoldedReleases[1],
			$SnapPointsFolded,
			$RulersFolded,
			$SnapRadiusFolded).coords
	),
	undefined,
);

// //////////////////////////////////////

export const RulerSetRequest = writable(false);

export const CPAxiomPreview = derived(
	[CPStep, CPEdge0, CPRelease0Coords, CPDragCoords],
	([$CPStep, $CPEdge0, $CPRelease0Coords, $CPDragCoords]) => {
		if ($CPStep >= 2) { return; }
		if ($CPRelease0Coords) { return; }
		if ($CPEdge0 !== undefined && $CPDragCoords) {
			const pointString = `[${$CPDragCoords.join(", ")}]`;
			const args = [$CPEdge0, pointString].join(", ");
			execute(`setGuideLinesCP(axiom4(${args}))`);
		}
	},
	undefined,
);

export const CPAxiomRulers = derived(
	[CPStep, CPEdge0, CPRelease0Coords, RulerSetRequest],
	([$CPStep, $CPEdge0, $CPRelease0Coords, $RulerSetRequest]) => {
		if (!$RulerSetRequest) { return; }
		if ($CPStep < 2) { return; }
		if ($CPEdge0 !== undefined && $CPRelease0Coords) {
			const pointString = `[${$CPRelease0Coords.join(", ")}]`;
			const args = [$CPEdge0, pointString].join(", ");
			GuideLinesCP.set([]);
			RulerSetRequest.set(false);
			execute(`setRulersCP(axiom4(${args}))`);
		}
	},
	undefined,
);

export const CPAddSegment = derived(
	[CPPress1Coords, CPRelease1Coords],
	([$CPPress1Coords, $CPRelease1Coords]) => {
		if ($CPPress1Coords && $CPRelease1Coords) {
			executeCommand("segment", $CPPress1Coords, $CPRelease1Coords);
			reset();
		}
	},
	undefined,
);

export const CPHighlights = derived(
	CPEdge0,
	($CPEdge0) => {
		Highlight.reset();
		Highlight.addEdges([$CPEdge0].filter(a => a !== undefined));
	},
	undefined,
);

// //////////////////////////////////////////

export const FoldedAxiomPreview = derived(
	[FoldedStep, FoldedEdge0, FoldedRelease0Coords, FoldedDragCoords],
	([$FoldedStep, $FoldedEdge0, $FoldedRelease0Coords, $FoldedDragCoords]) => {
		if ($FoldedStep >= 2) { return; }
		if ($FoldedRelease0Coords) { return; }
		if ($FoldedEdge0 !== undefined && $FoldedDragCoords) {
			const pointString = `[${$FoldedDragCoords.join(", ")}]`;
			const args = [$FoldedEdge0, pointString].join(", ");
			execute(`setGuideLinesFolded(foldedAxiom4(${args}))`);
		}
	},
	undefined,
);

export const FoldedAxiomRulers = derived(
	[FoldedStep, FoldedEdge0, FoldedRelease0Coords, RulerSetRequest],
	([$FoldedStep, $FoldedEdge0, $FoldedRelease0Coords, $RulerSetRequest]) => {
		if (!$RulerSetRequest) { return; }
		if ($FoldedStep < 2) { return; }
		if ($FoldedEdge0 !== undefined && $FoldedRelease0Coords) {
			const pointString = `[${$FoldedRelease0Coords.join(", ")}]`;
			const args = [$FoldedEdge0, pointString].join(", ");
			GuideLinesFolded.set([]);
			RulerSetRequest.set(false);
			execute(`setRulersFolded(foldedAxiom4(${args}))`);
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

export const FoldedHighlights = derived(
	FoldedEdge0,
	($FoldedEdge0) => {
		Highlight.reset();
		Highlight.addEdges([$FoldedEdge0].filter(a => a !== undefined));
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
		CPHighlights.subscribe(() => {}),
		FoldedAxiomPreview.subscribe(() => {}),
		FoldedAxiomRulers.subscribe(() => {}),
		FoldedAddSegment.subscribe(() => {}),
		FoldedHighlights.subscribe(() => {}),
	];
};

export const unsubscribe = () => {
	unsub.forEach(u => u());
	unsub = [];
	reset();
};
