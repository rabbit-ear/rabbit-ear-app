import {
	writable,
	derived,
} from "svelte/store";
import {
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

export const CPMoveCoords = derived(
	[CPMove, CPStep, SnapPointsCP, RulersCP, SnapRadiusCP],
	([$CPMove, $CPStep, $SnapPointsCP, $RulersCP, $SnapRadiusCP]) => ($CPStep < 2
		? undefined
		: snapToRulerLine(
			$CPMove,
			$SnapPointsCP,
			$RulersCP,
			$SnapRadiusCP).coords
	),
	{ coords: undefined, snap: false },
);

export const CPDragCoords = derived(
	[CPDrag, CPStep, SnapPointsCP, RulersCP, SnapRadiusCP],
	([$CPDrag, $CPStep, $SnapPointsCP, $RulersCP, $SnapRadiusCP]) => ($CPStep < 2
		? undefined
		: snapToRulerLine(
			$CPDrag,
			$SnapPointsCP,
			$RulersCP,
			$SnapRadiusCP).coords
	),
	{ coords: undefined, snap: false },
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

export const CPEdge1 = derived(
	[CPReleases, CPDrag, CreasePattern],
	([$CPReleases, $CPDrag, $CreasePattern]) => snapToEdge(
		[$CPReleases[0], $CPDrag].filter(a => a !== undefined).shift(),
		$CreasePattern,
		Infinity,
	).edge,
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

export const FoldedMoveCoords = derived(
	[FoldedMove, FoldedStep, SnapPointsFolded, RulersFolded, SnapRadiusFolded],
	([$FoldedMove, $FoldedStep, $SnapPointsFolded, $RulersFolded, $SnapRadiusFolded]) => ($FoldedStep < 2
		? undefined
		: snapToRulerLine(
			$FoldedMove,
			$SnapPointsFolded,
			$RulersFolded,
			$SnapRadiusFolded).coords
	),
	{ coords: undefined, snap: false },
);

export const FoldedDragCoords = derived(
	[FoldedDrag, FoldedStep, SnapPointsFolded, RulersFolded, SnapRadiusFolded],
	([$FoldedDrag, $FoldedStep, $SnapPointsFolded, $RulersFolded, $SnapRadiusFolded]) => ($FoldedStep < 2
		? undefined
		: snapToRulerLine(
			$FoldedDrag,
			$SnapPointsFolded,
			$RulersFolded,
			$SnapRadiusFolded).coords
	),
	{ coords: undefined, snap: false },
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

export const FoldedEdge1 = derived(
	[FoldedReleases, FoldedDrag, FoldedForm],
	([$FoldedReleases, $FoldedDrag, $FoldedForm]) => snapToEdge(
		[$FoldedReleases[0], $FoldedDrag].filter(a => a !== undefined).shift(),
		$FoldedForm,
		Infinity,
	).edge,
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
	[CPStep, CPEdge0, CPEdge1],
	([$CPStep, $CPEdge0, $CPEdge1]) => {
		if ($CPStep < 2 && $CPEdge0 !== undefined && $CPEdge1 !== undefined) {
			const args = [$CPEdge0, $CPEdge1].join(", ");
			execute(`setGuideLinesCP(axiom3(${args}))`);
		}
	},
	undefined,
);

export const CPAxiomRulers = derived(
	[CPStep, CPEdge0, CPEdge1, RulerSetRequest],
	([$CPStep, $CPEdge0, $CPEdge1, $RulerSetRequest]) => {
		if (!$RulerSetRequest) { return; }
		if ($CPStep >= 2 && $CPEdge0 !== undefined && $CPEdge1 !== undefined) {
			const args = [$CPEdge0, $CPEdge1].join(", ");
			GuideLinesCP.set([]);
			RulerSetRequest.set(false);
			execute(`setRulersCP(axiom3(${args}))`);
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
	[CPEdge0, CPEdge1],
	([$CPEdge0, $CPEdge1]) => {
		Highlight.reset();
		Highlight.addEdges([$CPEdge0, $CPEdge1].filter(a => a !== undefined));
	},
	undefined,
);

// //////////////////////////////////////////

export const FoldedAxiomPreview = derived(
	[FoldedStep, FoldedEdge0, FoldedEdge1],
	([$FoldedStep, $FoldedEdge0, $FoldedEdge1]) => {
		if ($FoldedStep < 2 && $FoldedEdge0 !== undefined && $FoldedEdge1 !== undefined) {
			const args = [$FoldedEdge0, $FoldedEdge1].join(", ");
			execute(`setGuideLinesFolded(foldedAxiom3(${args}))`);
		}
	},
	undefined,
);

export const FoldedAxiomRulers = derived(
	[FoldedStep, FoldedEdge0, FoldedEdge1, RulerSetRequest],
	([$FoldedStep, $FoldedEdge0, $FoldedEdge1, $RulerSetRequest]) => {
		if (!$RulerSetRequest) { return; }
		if ($FoldedStep >= 2 && $FoldedEdge0 !== undefined && $FoldedEdge1 !== undefined) {
			const args = [$FoldedEdge0, $FoldedEdge1].join(", ");
			GuideLinesFolded.set([]);
			RulerSetRequest.set(false);
			execute(`setRulersFolded(foldedAxiom3(${args}))`);
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
	[FoldedEdge0, FoldedEdge1],
	([$FoldedEdge0, $FoldedEdge1]) => {
		Highlight.reset();
		Highlight.addEdges([$FoldedEdge0, $FoldedEdge1].filter(a => a !== undefined));
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
