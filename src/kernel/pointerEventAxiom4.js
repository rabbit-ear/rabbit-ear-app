import { get } from "svelte/store";
import { nearest } from "rabbit-ear/graph/nearest.js";
import { Selection } from "../stores/Select.js";
import {
	Presses,
	Releases,
} from "../stores/UI.js";
import { getSnapPoint } from "../js/nearest.js";
import { execute } from "./app.js";
import { RulerLines, RulerLinePreviews } from "../stores/Ruler.js";
import { Graph } from "../stores/Graph.js";
import { RulersAutoClear } from "../stores/App.js";

let pressEdge = undefined;

export const pointerEventAxiom4 = (eventType, { point }) => {
	switch (eventType) {
	case "press": Presses.update(p => [...p, point]); break;
	case "hover": break;
	case "move": break;
	case "release": Releases.update(p => [...p, point]); break;
	}
	const { vertex, edge } = nearest(get(Graph), point);
	switch (eventType) {
	case "hover":
		Selection.reset();
		if (edge !== undefined) { Selection.addEdges([edge]); }
		break;
	case "press":
		pressEdge = edge;
		if (get(RulersAutoClear)) { RulerLines.set([]); }
		// no break
	case "move":
		Selection.reset();
		if (vertex !== undefined) { Selection.addVertices([vertex]); }
		if (edge !== undefined) { Selection.addEdges([pressEdge]); }
		execute("axiom4Preview", pressEdge, vertex);
		break;
	case "release":
		execute("axiom4", pressEdge, vertex);
		pressEdge = undefined;
		RulerLinePreviews.set([]);
		Presses.set([]);
		Releases.set([]);
		break;
	}
};
