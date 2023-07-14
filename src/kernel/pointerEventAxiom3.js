import { get } from "svelte/store";
import { nearest } from "rabbit-ear/graph/nearest.js";
import { Selection } from "../stores/Select.js";
import {
	Current,
	Presses,
	Moves,
	Releases,
} from "../stores/UI.js";
import { getSnapPoint } from "../js/nearest.js";
import { execute } from "./app.js";
import { Rulers } from "../stores/Ruler.js";
import { Graph } from "../stores/Graph.js";

let pressEdge = undefined;
let releaseEdge = undefined;

export const pointerEventAxiom3 = (eventType) => {
	const { edge } = nearest(get(Graph), get(Current));
	switch (eventType) {
	case "hover":
		Selection.reset();
		if (edge !== undefined) {
			Selection.addEdges([edge]);
		}
		break;
	case "press": {
		pressEdge = edge;
		execute("axiom3Preview", pressEdge, edge);
		Rulers.reset();
		Selection.reset();
		if (edge !== undefined) {
			Selection.addEdges([edge]);
		}
	}
		break;
	case "move": {
		releaseEdge = edge;
		execute("axiom3Preview", pressEdge, releaseEdge);
		Selection.reset();
		Selection.addEdges([pressEdge, releaseEdge]
			.filter(a => a !== undefined));
	}
		break;
	case "release":
		releaseEdge = edge;
		execute("axiom3", pressEdge, releaseEdge);
		Presses.set([]);
		Moves.set([]);
		Releases.set([]);
		break;
	}
};
