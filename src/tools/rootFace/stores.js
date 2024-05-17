import {
	writable,
	derived,
} from "svelte/store";
import {
	getFacesUnderPoint,
} from "rabbit-ear/graph/overlap.js";
import {
	CreasePattern,
} from "../../stores/ModelCP.js";
import {
	FoldedRootFace,
} from "../../stores/ModelFolded.js";
import { Highlight } from "../../stores/UI.js";

export const Press = writable(undefined);

const PressFace = derived(
	[Press, CreasePattern],
	([$Press, $CreasePattern]) => {
		try {
			if (!$Press) { return; }
			const face = getFacesUnderPoint(
				$CreasePattern,
				$Press,
				// undefined,
				n => n > -1e-3,
			).shift();
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
