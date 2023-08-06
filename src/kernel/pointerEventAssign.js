import { snapToEdge } from "../js/snap.js";
import { get } from "svelte/store";
import { Highlight } from "../stores/Select.js";
import {
	ASSIGN_SWAP,
	ASSIGN_FLAT,
	ASSIGN_UNASSIGNED,
	ASSIGN_CUT,
	ASSIGN_BOUNDARY,
} from "../app/keys.js";
import { AssignType } from "../stores/Tool.js";
import { execute } from "./app.js";

const performAssignment = (edge) => {
	switch (get(AssignType)) {
	case ASSIGN_SWAP: return execute("toggleAssignment", [edge]);
	case ASSIGN_FLAT: return execute("setAssignment", [edge], "F", 0);
	case ASSIGN_UNASSIGNED: return execute("setAssignment", [edge], "U", 0);
	case ASSIGN_CUT: return execute("setAssignment", [edge], "C", 0);
	case ASSIGN_BOUNDARY: return execute("setAssignment", [edge], "B", 0);
	default: break;
	}
};

export const pointerEventAssign = (eventType, { point }) => {
	Highlight.reset();
	const { edge } = snapToEdge(point);
	if (edge === undefined) { return; }
	Highlight.addEdges([edge]);
	switch (eventType) {
	case "press": return performAssignment(edge);
	case "hover": break;
	case "move": break;
	case "release": break;
	}
};
