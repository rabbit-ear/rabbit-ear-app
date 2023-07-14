import { add2, subtract2 } from "rabbit-ear/math/algebra/vector.js";
// import normalize from "rabbit-ear/graph/normalize.js";
import { get } from "svelte/store";
import { Selection } from "../stores/Select.js";
import { Graph, UIGraph } from "../stores/Graph.js";
import {
	Presses,
	Moves,
	Releases,
	Current
} from "../stores/UI.js";
import { getSnapPoint } from "../js/nearest.js";
import { subgraphWithVertices, normalize } from "../js/subgraph.js";
import { execute } from "./app.js";

const getDragVector = () => {
	const origin = get(Presses)[0];
	const end = get(Current);
	if (!origin || !end) { return [0, 0]; }
	return subtract2(end, origin);
};

export const pointerEventVertex = (eventType) => {
	switch (eventType) {
	case "press":
		const { coords, vertex } = getSnapPoint(get(Current));
		if (vertex !== undefined) {
			Selection.reset();
			Selection.addVertices([vertex]);
			break;
		}
		execute("addVertex", coords);
		break;
	case "move": {
		const dragVector = getDragVector();
		const selVerts = get(Selection).vertices;
		const subgraph = subgraphWithVertices(get(Graph), selVerts);
		selVerts.forEach(v => {
			subgraph.vertices_coords[v] = add2(subgraph.vertices_coords[v], dragVector);
		});
		normalize(subgraph);
		UIGraph.set({ ...subgraph });
	}
		break;
	case "release":
		UIGraph.set({});
		// move currently selected vertices
		execute("translateVertices", get(Selection).vertices, getDragVector());
		Presses.set([]);
		Moves.set([]);
		Releases.set([]);
		Selection.reset();
		break;
	default:
		console.warn("no switch definition for", eventType);
	}
};
