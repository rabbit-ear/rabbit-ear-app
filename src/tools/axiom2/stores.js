import {
	writable,
	derived,
} from "svelte/store";
import {
	snapToPoint,
	snapToRulerLine,
} from "../../js/snap.js";
import { zipArrays } from "../../js/arrays.js";
import execute from "../../kernel/execute.js";

export const reset = () => {
	Hover.set(undefined);
	Move.set(undefined);
	Presses.set([]);
	Releases.set([]);
};

export const Hover = writable(undefined);
export const Move = writable(undefined);
export const Presses = writable([]);
export const Releases = writable([]);

export const Touches = derived(
	[Hover, Move, Presses, Releases],
	([$Hover, $Move, $Presses, $Releases]) => zipArrays($Presses, $Releases)
		.concat([$Hover])
		.concat([$Move])
		.filter(a => a !== undefined),
	[],
);

export const Step = derived(Touches, ($Touches) => $Touches.length, 0);

export const Coords0 = derived(
	Touches,
	($Touches) => snapToPoint($Touches[0], false),
	undefined,
);

export const Coords1 = derived(
	Touches,
	($Touches) => snapToPoint($Touches[1], false),
	undefined,
);

export const Coords2 = derived(
	Touches,
	($Touches) => snapToRulerLine($Touches[2], false).coords,
	undefined,
);

export const Coords3 = derived(
	Touches,
	($Touches) => snapToRulerLine($Touches[3], false).coords,
	undefined,
);

export const AxiomPreview = derived(
	[Coords0, Coords1],
	([$Coords0, $Coords1]) => (
		($Coords0 !== undefined && $Coords1 !== undefined
			? execute("axiom2Preview", $Coords0, $Coords1)
			: undefined)),
	undefined,
);

AxiomPreview.subscribe(() => {});
