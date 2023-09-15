import { get } from "svelte/store";
import {
	ASSIGN_SWAP,
	ASSIGN_FLAT,
	ASSIGN_UNASSIGNED,
	ASSIGN_CUT,
	ASSIGN_JOIN,
	ASSIGN_BOUNDARY,
} from "../../app/keys.js";
import {
	AssignType,
	Move,
	Edge,
} from "./stores.js";
import { executeCommand } from "../../kernel/execute.js";

const lookup = {
	[ASSIGN_FLAT]: "F",
	[ASSIGN_UNASSIGNED]: "U",
	[ASSIGN_CUT]: "C",
	[ASSIGN_JOIN]: "J",
	[ASSIGN_BOUNDARY]: "B",
};

const setAssignment = (edge, assignType) => {
	if (edge === undefined) { return; }
	return lookup[assignType]
		? executeCommand("setAssignment", [edge], lookup[assignType], 0)
		: executeCommand("toggleAssignment", [edge]);
};

const pointerEvent = (eventType, { point }) => {
	if (eventType === "press") {
		return setAssignment(get(Edge), get(AssignType));
	}
	Move.set(point);
};

export default pointerEvent;
