import { writable, derived } from "svelte/store";
import {
	snapOldToPoint,
	snapToEdge,
	snapOldToRulerLine,
} from "../../js/snapOld.js";
import { zipArrays } from "../../js/arrays.js";
import { execute } from "../../kernel/execute.js";
import { GuideLinesCP, Highlight } from "../../stores/UI.js";
import { RulersCP } from "../../stores/Ruler.js";

export const Move = writable(undefined);
export const Presses = writable([]);
export const Releases = writable([]);

export const Touches = derived(
	[Move, Presses, Releases],
	([$Move, $Presses, $Releases]) =>
		zipArrays($Presses, $Releases)
			.concat([$Move])
			.filter((a) => a !== undefined),
	[],
);

export const Step = derived(Touches, ($Touches) => $Touches.length, 0);

export const InputPoint0 = derived(
	Touches,
	($Touches) => snapOldToPoint($Touches[0], false),
	undefined,
);

export const InputEdge = derived(
	Touches,
	($Touches) => snapToEdge($Touches[1], false).edge,
	undefined,
);

export const InputPoint1 = derived(
	Touches,
	($Touches) => snapOldToPoint($Touches[2], false),
	undefined,
);

// Touch[3] is skipped.

export const Segment0 = derived(
	Touches,
	($Touches) => snapOldToRulerLine($Touches[4], false).coords,
	undefined,
);

export const Segment1 = derived(
	Touches,
	($Touches) => snapOldToRulerLine($Touches[5], false).coords,
	undefined,
);

export const Highlights = derived(
	[InputEdge],
	([$InputEdge]) => {
		Highlight.reset();
		const edges = [$InputEdge].filter((a) => a !== undefined);
		Highlight.addEdges(edges);
	},
	undefined,
);

export const AxiomPreview = derived(
	[InputEdge, InputPoint0, InputPoint1],
	([$InputEdge, $InputPoint0, $InputPoint1]) =>
		$InputEdge !== undefined &&
		$InputPoint0 !== undefined &&
		$InputPoint1 !== undefined
			? execute(
					`setGuideLinesCP(axiom5(${$InputEdge}, ${JSON.stringify($InputPoint0)}, ${JSON.stringify($InputPoint1)}))`,
				)
			: GuideLinesCP.set([]),
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
	if (unsub0) {
		unsub0();
	}
	if (unsub1) {
		unsub1();
	}
};
