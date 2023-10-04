import {
	writable,
	derived,
} from "svelte/store";
import { facesContainingPoint } from "rabbit-ear/graph/nearest.js";
import {
	CreasePattern,
	FoldedRootFace,
} from "../../stores/Model.js";
import { Highlight } from "../../stores/UI.js";
// import { executeCommand } from "../../kernel/execute.js";

export const Press = writable(undefined);

const PressFace = derived(
	[Press, CreasePattern],
	([$Press, $CreasePattern]) => {
		try {
			if (!$Press) { return; }
			const face = facesContainingPoint($CreasePattern, $Press, n => n > -1e-3).shift();
			FoldedRootFace.set(face);
		} catch (error) { console.warn(error); }
	},
	undefined,
);

const HighlightedFace = derived(
	[FoldedRootFace, CreasePattern],
	([$FoldedRootFace, $CreasePattern]) => {
		Highlight.reset();
		Highlight.addFaces([$FoldedRootFace]);
	},
	undefined,
);

export const reset = () => {
	Press.set(undefined);
};

let unsubs = [];

export const subscribe = () => {
	unsubs = [
		PressFace.subscribe(() => {}),
		HighlightedFace.subscribe(() => {}),
	];
};

export const unsubscribe = () => {
	unsubs.forEach(f => f());
	reset();
};
