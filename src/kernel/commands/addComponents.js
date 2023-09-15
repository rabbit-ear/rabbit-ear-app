import AddVertex from "rabbit-ear/graph/add/addVertex.js";
import addPlanarLine from "rabbit-ear/graph/add/addPlanarLine.js";
import addNonPlanarEdge from "rabbit-ear/graph/add/addNonPlanarEdge.js";
import { get } from "svelte/store";
import { NewEdgeAssignment } from "../../stores/App.js";
import {
	Graph,
	UpdateFrame,
} from "../../stores/Model.js";

export const vertex = (coords) => {
	const graph = get(Graph);
	const newestVertex = AddVertex(graph, coords);
	UpdateFrame({ ...graph });
	return newestVertex;
};

export const segment = (coords0, coords1) => {
	const graph = get(Graph);
	const vertex0 = AddVertex(graph, coords0);
	const vertex1 = AddVertex(graph, coords1);
	const newestEdge = addNonPlanarEdge(graph, [vertex0, vertex1]);
	doSetEdgesAssignment(graph, [newestEdge], get(NewEdgeAssignment));
	UpdateFrame({ ...graph });
	return newestEdge;
};

export const edge = (vertexA, vertexB) => {
	const g = get(Graph);
	const newestEdge = addNonPlanarEdge(g, [vertexA, vertexB]);
	doSetEdgesAssignment(g, [newestEdge], get(NewEdgeAssignment));
	UpdateFrame({ ...g });
	return newestEdge;
};

export const line = (line) => {
	const graph = get(Graph);
	const result = addPlanarLine(graph, line);
	UpdateFrame({ ...graph });
	return result;
};

export const polyline = (polyline) => {
	const graph = get(Graph);
	const vertices = polyline.map(point => AddVertex(graph, point));
	const edges = Array.from(Array(vertices.length - 1))
		.map((_, i) => i)
		.map(i => addNonPlanarEdge(graph, [vertices[i], vertices[i + 1]]));
	doSetEdgesAssignment(graph, edges, get(NewEdgeAssignment));
	UpdateFrame({ ...graph });
	return edges;
};
