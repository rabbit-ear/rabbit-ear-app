import { writable, derived } from "svelte/store";
import { snapToEdge } from "../../js/snap.js";
import { executeCommand } from "../../kernel/execute.js";

export const Move = writable(undefined);

export const Edge = derived(
	Move,
	($Move) => snapToEdge($Move).edge,
	undefined,
);

export const Highlights = derived(
	Edge,
	($Edge) => ($Edge !== undefined
		? executeCommand("highlight", { edges: [$Edge] })
		: executeCommand("highlight", {})),
	undefined,
);

let unsub;

export const subscribe = () => {
	unsub = Highlights.subscribe(() => {});
};

export const unsubscribe = () => {
	if (unsub) { unsub(); }
};
