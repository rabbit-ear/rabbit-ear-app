import { writable, derived } from "svelte/store";
import { snapToEdge } from "../../js/snap.js";
import executeUI from "../../kernel/executeUI.js";

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
		? executeUI("highlight", { edges: [$Edge] })
		: executeUI("highlight", {})),
	undefined,
);

let unsub;

export const subscribe = () => {
	unsub = Highlights.subscribe(() => {});
};

export const unsubscribe = () => {
	if (unsub) { unsub(); }
};
