import { writable, derived } from "svelte/store";
import { snapToEdge } from "../../js/snap.js";
import { executeCommand } from "../../kernel/execute.js";
import { Highlight } from "../../stores/UI.js";

export const ASSIGN_SWAP = "assignSwap";
export const ASSIGN_FLAT = "assignFlat";
export const ASSIGN_UNASSIGNED = "assignUnassigned";
export const ASSIGN_JOIN = "assignJoin";
export const ASSIGN_CUT = "assignCut";
export const ASSIGN_BOUNDARY = "assignBoundary";

export const AssignType = writable(ASSIGN_SWAP);

export const Move = writable(undefined);

export const Edge = derived(
	Move,
	($Move) => snapToEdge($Move).edge,
	undefined,
);

export const Highlights = derived(
	Edge,
	($Edge) => ($Edge !== undefined
		// ? executeCommand("highlight", { edges: [$Edge] })
		// : executeCommand("highlight", {})),
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
