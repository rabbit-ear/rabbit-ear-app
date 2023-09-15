import { get } from "svelte/store";
import { nearest } from "rabbit-ear/graph/nearest.js";
import { Selection } from "../../stores/Select.js";
import {
	UILines,
} from "../../stores/UI.js";
import execute from "../../kernel/execute.js";
import { RulerLines } from "../../stores/Ruler.js";
import { Graph } from "../../stores/Model.js";
import { RulersAutoClear } from "../../stores/App.js";
import {
	Presses,
	Releases,
	ToolStep,
} from "./stores.js";

let vertex1 = undefined;
let edge1 = undefined;
let vertex2 = undefined;

const pointerEventAxiom6 = (eventType, { point }) => {
	switch (eventType) {
	case "press": Presses.update(p => [...p, point]); break;
	case "release": Releases.update(p => [...p, point]); break;
	default: break;
	}
	const { vertex, edge } = nearest(get(Graph), point);
	Selection.reset();
	// console.log(toolStep, eventType, edge1, vertex1, vertex);
	switch (get(ToolStep)) {
	case 0:
		if (vertex !== undefined) { Selection.addVertices([vertex]); }
		break;
	case 1:
		if (eventType === "press") { vertex1 = vertex; }
		if (get(RulersAutoClear)) { RulerLines.set([]); }
		// UILines.set([]);
		if (vertex1 !== undefined) { Selection.addVertices([vertex1]); }
		if (edge !== undefined) { Selection.addEdges([edge]); }
		break;
	case 2:
		if (eventType === "release") { edge1 = edge; }
		if (vertex1 !== undefined) { Selection.addVertices([vertex1]); }
		if (edge1 !== undefined) { Selection.addEdges([edge1]); }
		if (vertex !== undefined) { Selection.addVertices([vertex]); }
		break;
	case 3:
		if (eventType === "press") { vertex2 = vertex; }
		if (vertex1 !== undefined) { Selection.addVertices([vertex1]); }
		if (edge1 !== undefined) { Selection.addEdges([edge1]); }
		if (vertex !== undefined) { Selection.addVertices([vertex]); }
		if (edge !== undefined) { Selection.addEdges([edge]); }
		execute("axiom6Preview", edge1, edge, vertex1, vertex2);
		break;
	case 4:
	default:
		execute("axiom6Rulers", edge1, edge, vertex1, vertex2);
		vertex1 = undefined;
		edge1 = undefined;
		UILines.set([]);
		Presses.set([]);
		Releases.set([]);
		break;
	}
};

export default pointerEventAxiom6;
