import { get } from "svelte/store";
import Tools from "../../tools/index.js";
import { Tool } from "../../stores/UI.js";
import { NewEdgeAssignment } from "../../stores/App.js";
import {
	AssignType,
	ASSIGN_SWAP,
	ASSIGN_FLAT,
	ASSIGN_UNASSIGNED,
	ASSIGN_JOIN,
	ASSIGN_CUT,
	ASSIGN_BOUNDARY,
} from "../../tools/assignment/stores.js";

export const resetTool = () => {
	const tool = get(Tool);
	if (tool && tool.reset) {
		tool.reset();
	}
};

export const setTool = (toolName) => {
	const newTool = Tools[toolName];
	if (!newTool) {
		return;
	}
	Tool.set(newTool);
};

const AssignAssignLookup = {
	B: ASSIGN_BOUNDARY,
	b: ASSIGN_BOUNDARY,
	M: ASSIGN_SWAP,
	m: ASSIGN_SWAP,
	V: ASSIGN_SWAP,
	v: ASSIGN_SWAP,
	F: ASSIGN_FLAT,
	f: ASSIGN_FLAT,
	C: ASSIGN_CUT,
	c: ASSIGN_CUT,
	J: ASSIGN_JOIN,
	j: ASSIGN_JOIN,
	U: ASSIGN_UNASSIGNED,
	u: ASSIGN_UNASSIGNED,
};

export const setToolAssignment = (assignment) => {
	const tool = get(Tool);
	if (!tool) {
		return;
	}
	if (tool.name === "assignment") {
		if (AssignAssignLookup[assignment]) {
			AssignType.set(AssignAssignLookup[assignment]);
		}
	} else {
		NewEdgeAssignment.set(assignment.toUpperCase());
	}
};
