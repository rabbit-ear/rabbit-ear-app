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
import { RulersCP } from "../../stores/Ruler.js";
import {
	SnapPoint,
	UILines,
	Highlight,
} from "../../stores/UI.js";

export const Move = writable(undefined);
export const Drag = writable(undefined);
export const Presses = writable([]);
export const Releases = writable([]);

export const Step = derived(
	[Presses, Releases],
	([$Presses, $Releases]) => $Presses.length + $Releases.length,
	0,
);

export const MoveCoords = derived(
	[Move, Step],
	([$Move, $Step]) => $Step < 2
		? undefined
		: snapToRulerLine($Move).coords,
	({}),
);

export const DragCoords = derived(
	[Drag, Step],
	([$Drag, $Step]) => $Step < 2
		? undefined
		: snapToRulerLine($Drag).coords,
	({}),
);

export const Edge0 = derived(
	[Presses, Move],
	([$Presses, $Move]) => snapToEdge(
		[$Presses[0], $Move].filter(a => a !== undefined).shift(),
		false,
	).edge,
	undefined,
);

export const Edge1 = derived(
	[Releases, Drag],
	([$Releases, $Drag]) => snapToEdge(
		[$Releases[0], $Drag].filter(a => a !== undefined).shift(),
		false,
	).edge,
	undefined,
);

export const Segment0 = derived(
	Presses,
	($Presses) => snapToRulerLine($Presses[1], false).coords,
	undefined,
);

export const Segment1 = derived(
	Releases,
	($Releases) => snapToRulerLine($Releases[1], false).coords,
	undefined,
);

export const AxiomPreview = derived(
	[Step, Edge0, Edge1],
	([$Step, $Edge0, $Edge1]) => {
		if ($Step < 2 && $Edge0 !== undefined && $Edge1 !== undefined) {
			const args = [$Edge0, $Edge1].join(", ");
			execute(`setUILines(axiom3(${args}))`);
		}
	},
	undefined,
);

export const AxiomRulers = derived(
	[Step, Edge0, Edge1],
	([$Step, $Edge0, $Edge1]) => {
		if ($Step >= 2 && $Edge0 !== undefined && $Edge1 !== undefined) {
			const args = [$Edge0, $Edge1].join(", ");
			UILines.set([]);
			execute(`setRulerLines(axiom3(${args}))`);
		}
	},
	undefined,
);

export const DoAxiom = derived(
	[Segment0, Segment1],
	([$Segment0, $Segment1]) => {
		if ($Segment0 && $Segment1) {
			executeCommand("segment", $Segment0, $Segment1);
			reset();
		}
	},
	undefined,
);

export const Highlights = derived(
	[Edge0, Edge1],
	([$Edge0, $Edge1]) => {
		Highlight.reset();
		Highlight.addEdges([$Edge0, $Edge1].filter(a => a !== undefined));
	},
	undefined,
);

export const reset = () => {
	Move.set(undefined);
	Drag.set(undefined);
	Presses.set([]);
	Releases.set([]);
	UILines.set([]);
	RulersCP.set([]);
};

let unsub = [];

export const subscribe = () => {
	unsub = [
		AxiomPreview.subscribe(() => {}),
		AxiomRulers.subscribe(() => {}),
		DoAxiom.subscribe(() => {}),
		Highlights.subscribe(() => {}),
	];
};

export const unsubscribe = () => {
	unsub.forEach(u => u());
	reset();
};
