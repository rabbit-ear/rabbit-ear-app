import { writable, derived } from "svelte/store";
import { snapToEdge } from "../../js/snapOld.js";
import { executeCommand } from "../../kernel/execute.js";
import { Highlight } from "../../stores/UI.js";

export const FoldAngleValue = writable(90);

export const Move = writable(undefined);

export const Edge = derived(
	Move,
	($Move) => snapToEdge($Move).edge,
	undefined,
);

export const Highlights = derived(
	Edge,
	($Edge) => ($Edge !== undefined
		? Highlight.setEdges([$Edge])
		: Highlight.reset()),
	undefined,
);

let unsub;

export const subscribe = () => {
	unsub = Highlights.subscribe(() => {});
};

export const unsubscribe = () => {
	if (unsub) { unsub(); }
};
