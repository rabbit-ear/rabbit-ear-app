import { nearest } from "rabbit-ear/graph/nearest.js";
import {
	distance2,
	subtract2,
} from "rabbit-ear/math/algebra/vector.js";
import { get } from "svelte/store";
import { graph } from "../stores/graph.js";
import { viewBox } from "../stores/viewBox.js";
// import { selected } from "../stores/select.js";
import { current } from "../stores/ui.js";
import { execute } from "./app.js";

const getNearestToPoint = (graph, point) => {
	const result = { vertices: [], edges: [], faces: [] };
	const near = nearest(graph, point);
	result.vertices[near.vertex] = true;
	result.edges[near.edge] = true;
	result.faces[near.face] = true;
	return result;
};

export const pointerEventSplitEdge = (eventType) => {
	switch (eventType) {
	case "press": {
		const edge = nearest(get(graph), get(current)).edge;
		if (edge === undefined) { break; }
		const edges = [];
		edges[edge] = true;
		// selected.set({ ...get(selected), edges });
		execute("splitEdges", [edge]);
	}
		break;
	case "hover": {
		const edge = nearest(get(graph), get(current)).edge;
		if (edge === undefined) { break; }
		const edges = [];
		edges[edge] = true;
		// selected.set({ ...get(selected), edges });
	}
		break;
	case "move":
		break;
	case "release":
		break;
	}
};
