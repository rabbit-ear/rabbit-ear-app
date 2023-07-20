import { get } from "svelte/store";
import { nearest } from "rabbit-ear/graph/nearest.js";
import { Selection } from "../stores/Select.js";
import {
	Presses,
	Moves,
	Releases,
} from "../stores/UI.js";
import { getSnapPoint } from "../js/nearest.js";
import { execute } from "./app.js";
import { Rulers, RulerPreviews } from "../stores/Ruler.js";
import { Graph } from "../stores/Graph.js";
import { RulersAutoClear } from "../stores/App.js";
import { ToolStep } from "../stores/Tool.js";

let pressEdge = undefined;
let pressVertex = undefined;

export const pointerEventScribble = (eventType, { point }) => {
	switch (eventType) {
	case "press": Presses.update(p => [...p, point]); break;
	case "hover": break;
	case "move": Moves.update(p => [...p, point]); break;
	case "release": Releases.update(p => [...p, point]); break;
	}
	const toolStep = get(ToolStep);
	const { vertex, edge } = nearest(get(Graph), point);
	Selection.reset();
	switch (toolStep) {
	case 0:
		if (edge !== undefined) { Selection.addEdges([edge]); }
		break;
	case 1:
		// "press" selecting the first edge
		// "move" preview the second edge
		if (eventType === "press") { pressEdge = edge; }
		if (get(RulersAutoClear)) { Rulers.set([]); }
		if (edge !== undefined) { Selection.addEdges([edge]); }
		if (pressEdge !== undefined) { Selection.addEdges([pressEdge]); }
		execute("axiom3Preview", pressEdge, edge);
		break;
	case 2:
		// "release" axiom operation done
		// "hover" preview first edge point
		RulerPreviews.set([]);
		if (eventType === "release") {
			execute("axiom3", pressEdge, edge);
			pressEdge = undefined;
		}
		if (vertex !== undefined) { Selection.addVertices([vertex]); }
		break;
	case 3:
		// "press" selecting first edge point
		// "move" preview second edge point
		if (eventType === "press") { pressVertex = vertex; }
		if (vertex !== undefined) { Selection.addVertices([vertex]); }
		break;
	default:
		// "release" drawing edge, reset all
		// if (pressVertex === undefined) {
		// 	pressVertex = execute("addVertex", pressCoords);
		// }
		// if (vertex === undefined) {
		// 	releaseVertex = execute("addVertex", releaseCoords);
		// }
		if (get(RulersAutoClear)) { Rulers.set([]); }
		execute("addEdge", pressVertex, vertex);
		Presses.set([]);
		Moves.set([]);
		Releases.set([]);
		break;
	}
};
