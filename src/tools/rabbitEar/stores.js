import { writable, derived } from "svelte/store";
import { Highlight } from "../../stores/UI.js";
import { CreasePattern } from "../../stores/ModelCP.js";
import { nearestFace } from "rabbit-ear/graph/nearest.js";

export const Move = writable(undefined);
export const Press = writable(undefined);
export const Drag = writable(undefined);
export const Release = writable(undefined);

export const HighlightHover = derived(
	[CreasePattern, Move],
	([$CreasePattern, $Move]) => {
		const face = nearestFace($CreasePattern, $Move);
		Highlight.reset();
		// Highlight.addVertices([nears.vertex]);
		// Highlight.addEdges([nears.edge]);
		Highlight.addFaces([face]);
	},
	{},
);

export const reset = () => {
	Move.set(undefined);
	Drag.set(undefined);
	Press.set(undefined);
	Release.set(undefined);
};

let unsub;

export const subscribe = () => {
	unsub = HighlightHover.subscribe(() => {});
};

export const unsubscribe = () => {
	if (unsub) {
		unsub();
	}
	reset();
};
