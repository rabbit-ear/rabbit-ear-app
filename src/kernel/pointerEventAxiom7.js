import { get } from "svelte/store";
import { nearest } from "rabbit-ear/graph/nearest.js";
import { Selection } from "../stores/Select.js";
import {
	Presses,
	Releases,
} from "../stores/UI.js";
import { execute } from "./app.js";
import { Rulers, RulerPreviews } from "../stores/Ruler.js";
import { ToolStep } from "../stores/Tool.js";
import { Graph } from "../stores/Graph.js";
import { RulersAutoClear } from "../stores/App.js";

let vertex1 = undefined;
let edge1 = undefined;

export const pointerEventAxiom7 = (eventType, { point }) => {
	switch (eventType) {
	case "press": Presses.update(p => [...p, point]); break;
	case "hover": break;
	case "move": break;
	case "release": Releases.update(p => [...p, point]); break;
	}
	const toolStep = get(ToolStep);
	const { vertex, edge } = nearest(get(Graph), point);
	Selection.reset();
	// console.log(toolStep, eventType, edge1, vertex1, vertex);
	switch (toolStep) {
	case 0:
		if (vertex !== undefined) { Selection.addVertices([vertex]); }
		break;
	case 1:
		if (eventType === "press") { vertex1 = vertex; }
		if (get(RulersAutoClear)) { Rulers.set([]); }
		// RulerPreviews.set([]);
		if (vertex1 !== undefined) { Selection.addVertices([vertex1]); }
		if (edge !== undefined) { Selection.addEdges([edge]); }
		break;
	case 2:
		if (eventType === "release") { edge1 = edge; }
		if (vertex1 !== undefined) { Selection.addVertices([vertex1]); }
		if (edge1 !== undefined) { Selection.addEdges([edge1]); }
		if (edge !== undefined) { Selection.addEdges([edge]); }
		execute("axiom7Preview", edge1, edge, vertex1);
		break;
	case 3:
		if (vertex1 !== undefined) { Selection.addVertices([vertex1]); }
		if (edge1 !== undefined) { Selection.addEdges([edge1]); }
		if (edge !== undefined) { Selection.addEdges([edge]); }
		execute("axiom7Preview", edge1, edge, vertex1);
		break;
	default:
		execute("axiom7", edge1, edge, vertex1);
		vertex1 = undefined;
		edge1 = undefined;
		RulerPreviews.set([]);
		Presses.set([]);
		Releases.set([]);
		break;
	}
};
