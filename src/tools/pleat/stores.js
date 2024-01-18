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
	Keyboard,
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

export const PleatCount = writable(4);
export const PleatAssignment = writable(["M", "V"]);

const ShiftPressed = derived(Keyboard, $Keyboard => $Keyboard[16], false);

export const CPMove = writable(undefined);
export const CPDrag = writable(undefined);
export const CPPress = writable(undefined);
export const CPRelease = writable(undefined);
export const FoldedMove = writable(undefined);
export const FoldedDrag = writable(undefined);
export const FoldedPress = writable(undefined);
export const FoldedRelease = writable(undefined);

export const CPEdge0 = derived(
	[CPPress, CPMove, CreasePattern],
	([$CPPress, $CPMove, $CreasePattern]) => snapToEdge(
		[$CPPress, $CPMove].filter(a => a !== undefined).shift(),
		$CreasePattern,
		Infinity,
	).edge,
	undefined,
);

export const CPEdge1 = derived(
	[CPRelease, CPDrag, CreasePattern],
	([$CPRelease, $CPDrag, $CreasePattern]) => snapToEdge(
		[$CPRelease, $CPDrag].filter(a => a !== undefined).shift(),
		$CreasePattern,
		Infinity,
	).edge,
	undefined,
);

export const FoldedEdge0 = derived(
	[FoldedPress, FoldedMove, FoldedForm],
	([$FoldedPress, $FoldedMove, $FoldedForm]) => snapToEdge(
		[$FoldedPress, $FoldedMove].filter(a => a !== undefined).shift(),
		$FoldedForm,
		Infinity,
	).edge,
	undefined,
);

export const FoldedEdge1 = derived(
	[FoldedRelease, FoldedDrag, FoldedForm],
	([$FoldedRelease, $FoldedDrag, $FoldedForm]) => snapToEdge(
		[$FoldedRelease, $FoldedDrag].filter(a => a !== undefined).shift(),
		$FoldedForm,
		Infinity,
	).edge,
	undefined,
);

// //////////////////////////////////////

export const CPPleatPreview = derived(
	[ShiftPressed, CPEdge0, CPEdge1, PleatCount, PleatAssignment],
	([$ShiftPressed, $CPEdge0, $CPEdge1, $PleatCount, $PleatAssignment]) => {
		if ($CPEdge0 !== undefined && $CPEdge1 !== undefined) {
			const args = [$CPEdge0, $CPEdge1, $PleatCount, $PleatAssignment, $ShiftPressed]
				.map(a => JSON.stringify(a))
				.join(", ");
			// console.log(`setGuideSegmentsCP(pleatPreview(${args}))`);
			// execute(`setGuideSegmentsCP(pleatPreview(${args}))`);
			execute(`setGhostGraphCP(pleatCP(${args}))`);
		}
	},
	undefined,
);

export const CPDoPleat = derived(
	[ShiftPressed, CPRelease, CPEdge0, CPEdge1, PleatCount, PleatAssignment],
	([$ShiftPressed, $CPRelease, $CPEdge0, $CPEdge1, $PleatCount, $PleatAssignment]) => {
		if ($CPRelease !== undefined && $CPEdge0 !== undefined && $CPEdge1 !== undefined) {
			GuideLinesCP.set([]);
			const args = [$CPEdge0, $CPEdge1, $PleatCount, $PleatAssignment, $ShiftPressed]
				.map(a => JSON.stringify(a))
				.join(", ");
			// executeCommand("pleat", $CPEdge0, $CPEdge1, $PleatCount, $PleatAssignment, $ShiftPressed);
			// executeCommand("pleatCP", $CPEdge0, $CPEdge1, $PleatCount, $PleatAssignment, $ShiftPressed);
			execute(`join(pleatCP(${args}))`);
			// execute(`setRulersCP(axiom3(${args}))`);
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

export const FoldedPleatPreview = derived(
	[FoldedEdge0, FoldedEdge1, PleatCount, PleatAssignment],
	([$FoldedEdge0, $FoldedEdge1, $PleatCount, $PleatAssignment]) => {
		if ($FoldedEdge0 !== undefined && $FoldedEdge1 !== undefined) {
			const args = [$FoldedEdge0, $FoldedEdge1, $PleatCount, $PleatAssignment]
				.map(a => JSON.stringify(a))
				.join(", ");
			console.log(`setGuideSegmentsFolded(pleatPreview(${args}))`);
			execute(`setGuideSegmentsFolded(pleatPreview(${args}))`);
			// const args = [$FoldedEdge0, $FoldedEdge1].join(", ");
			// execute(`setGuideSegmentsFolded(foldedAxiom3(${args}))`);
		}
	},
	undefined,
);

export const FoldedDoPleat = derived(
	[FoldedEdge0, FoldedEdge1, PleatCount, PleatAssignment],
	([$FoldedEdge0, $FoldedEdge1, $PleatCount, $PleatAssignment]) => {
		if ($FoldedEdge0 !== undefined && $FoldedEdge1 !== undefined) {
			const args = [$FoldedEdge0, $FoldedEdge1].join(", ");
			GuideLinesFolded.set([]);
			execute(`setRulersFolded(foldedAxiom3(${args}))`);
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
	CPPress.set(undefined);
	CPRelease.set(undefined);
	FoldedMove.set(undefined);
	FoldedDrag.set(undefined);
	FoldedPress.set(undefined);
	FoldedRelease.set(undefined);
	RulersCP.set([]);
	RulersFolded.set([]);
	GuideLinesCP.set([]);
	GuideLinesFolded.set([]);
};

let unsub = [];

export const subscribe = () => {
	unsub = [
		CPPleatPreview.subscribe(() => {}),
		CPDoPleat.subscribe(() => {}),
		CPHighlights.subscribe(() => {}),
		FoldedPleatPreview.subscribe(() => {}),
		FoldedDoPleat.subscribe(() => {}),
		FoldedHighlights.subscribe(() => {}),
	];
};

export const unsubscribe = () => {
	unsub.forEach(u => u());
	unsub = [];
	reset();
};
