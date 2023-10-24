import {
	writable,
	derived,
} from "svelte/store";
import {
	snapToPoint,
	snapToEdge,
	snapToRulerLine,
} from "../../js/snap.js";
import { zipArrays } from "../../js/arrays.js";
import {
	execute,
	executeCommand,
} from "../../kernel/execute.js";
import {
	GuideLinesCP,
	Highlight,
} from "../../stores/UI.js";
import { RulersCP } from "../../stores/Ruler.js";

export const Move = writable(undefined);
export const Presses = writable([]);
export const Releases = writable([]);

export const Touches = derived(
	[Move, Presses, Releases],
	([$Move, $Presses, $Releases]) => zipArrays($Presses, $Releases)
		.concat([$Move])
		.filter(a => a !== undefined),
	[],
);

export const Step = derived(Touches, ($Touches) => $Touches.length, 0);

export const InputEdge = derived(
	Touches,
	($Touches) => snapToEdge($Touches[0], false).edge,
	undefined,
);

export const InputPoint = derived(
	Touches,
	($Touches) => snapToPoint($Touches[1], false),
	undefined,
);

export const Segment0 = derived(
	Touches,
	($Touches) => snapToRulerLine($Touches[2], false).coords,
	undefined,
);

export const Segment1 = derived(
	Touches,
	($Touches) => snapToRulerLine($Touches[3], false).coords,
	undefined,
);

export const Highlights = derived(
	[InputEdge],
	([$InputEdge]) => {
		Highlight.reset();
		const edges = [$InputEdge].filter(a => a !== undefined);
		Highlight.addEdges(edges);
	},
	undefined,
);

export const AxiomPreview = derived(
	[InputEdge, InputPoint],
	([$InputEdge, $InputPoint]) => (
		($InputEdge !== undefined && $InputPoint !== undefined
			? execute(`setGuideLinesCP(axiom4(${$InputEdge}, ${JSON.stringify($InputPoint)}))`)
			// ? executeCommand("axiom4Preview", )
			: GuideLinesCP.set([]))),
	undefined,
);

export const reset = () => {
	Move.set(undefined);
	Presses.set([]);
	Releases.set([]);
	RulersCP.set([]);
};

let unsub0;
let unsub1;

export const subscribe = () => {
	unsub0 = AxiomPreview.subscribe(() => {});
	unsub1 = Highlights.subscribe(() => {});
};

export const unsubscribe = () => {
	reset();
	if (unsub0) { unsub0(); }
	if (unsub1) { unsub1(); }
};
