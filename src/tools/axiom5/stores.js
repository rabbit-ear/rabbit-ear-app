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
import { executeCommand } from "../../kernel/execute.js";
import { Highlight } from "../../stores/Select.js";
import { UILines } from "../../stores/UI.js";
import { RulerLines } from "../../stores/Ruler.js";

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

export const InputPoint0 = derived(
	Touches,
	($Touches) => snapToPoint($Touches[0], false),
	undefined,
);

export const InputEdge = derived(
	Touches,
	($Touches) => snapToEdge($Touches[1], false).edge,
	undefined,
);

export const InputPoint1 = derived(
	Touches,
	($Touches) => snapToPoint($Touches[2], false),
	undefined,
);

// Touch[3] is skipped.

export const Segment0 = derived(
	Touches,
	($Touches) => snapToRulerLine($Touches[4], false).coords,
	undefined,
);

export const Segment1 = derived(
	Touches,
	($Touches) => snapToRulerLine($Touches[5], false).coords,
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
	[InputEdge, InputPoint0, InputPoint1],
	([$InputEdge, $InputPoint0, $InputPoint1]) => (
		($InputEdge !== undefined
			&& $InputPoint0 !== undefined
			&& $InputPoint1 !== undefined
			? executeCommand("axiom5Preview", $InputEdge, $InputPoint0, $InputPoint1)
			: UILines.set([]))),
	undefined,
);

export const reset = () => {
	Move.set(undefined);
	Presses.set([]);
	Releases.set([]);
	RulerLines.set([]);
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
