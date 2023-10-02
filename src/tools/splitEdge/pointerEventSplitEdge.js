import { nearest } from "rabbit-ear/graph/nearest.js";
import { get } from "svelte/store";
import { CreasePattern } from "../stores/Model.js";
// import { selected } from "../stores/Select.js";
import { executeCommand } from "./execute.js";

const getNearestToPoint = (graph, point) => {
	const result = { vertices: [], edges: [], faces: [] };
	const near = nearest(graph, point);
	result.vertices[near.vertex] = true;
	result.edges[near.edge] = true;
	result.faces[near.face] = true;
	return result;
};

export const pointerEventSplitEdge = (eventType, { point }) => {
	switch (eventType) {
	case "press": {
		const edge = nearest(get(CreasePattern), point).edge;
		if (edge === undefined) { break; }
		const edges = [];
		edges[edge] = true;
		// selected.set({ ...get(selected), edges });
		executeCommand("splitEdges", [edge]);
	}
		break;
	case "hover": {
		const edge = nearest(get(CreasePattern), point).edge;
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
