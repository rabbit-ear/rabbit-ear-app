import {
	writable,
	derived,
} from "svelte/store";
import { facesContainingPoint } from "rabbit-ear/graph/nearest.js";
import { Selection } from "../../stores/Select.js";
import {
	CreasePattern,
	FoldedRootFace,
} from "../../stores/Model.js";
import { Highlight } from "../../stores/UI.js";
import { executeCommand } from "../../kernel/execute.js";

export const Move = writable(undefined);
export const Press = writable(undefined);
export const Release = writable(undefined);

const HighlightedFace = derived(
	[Move, Press, CreasePattern],
	([$Move, $Press, $CreasePattern]) => {
		try {
			const point = [$Press, $Move].filter(a => a !== undefined).shift();
			if (!point) { return; }
			const face = facesContainingPoint($CreasePattern, point, n => n > -1e-3).shift();
			Highlight.reset();
			if (face !== undefined) { Highlight.addFaces([face]); }
		} catch (error) { console.warn(error); }
	},
	undefined,
);

const PressFace = derived(
	[Press, CreasePattern],
	([$Press, $CreasePattern]) => {
		try {
			if (!$Press) { return; }
			const face = facesContainingPoint($CreasePattern, $Press, n => n > -1e-3).shift();
			Highlight.reset();
			if (face !== undefined) {
				Highlight.addFaces([face]);
				FoldedRootFace.set(face);
			}
		} catch (error) { console.warn(error); }
	},
	undefined,
);

export const reset = () => {
	Move.set(undefined);
	Press.set(undefined);
	Release.set(undefined);
};

let unsub0;
let unsub1;

export const subscribe = () => {
	unsub0 = HighlightedFace.subscribe(() => {});
	unsub1 = PressFace.subscribe(() => {});
};

export const unsubscribe = () => {
	unsub0();
	unsub1();
	reset();
};
