import AddVertex from "rabbit-ear/graph/add/addVertex.js";
import AddVertices from "rabbit-ear/graph/add/addVertices.js";
import addPlanarLine from "rabbit-ear/graph/add/addPlanarLine.js";
import addNonPlanarEdge from "rabbit-ear/graph/add/addNonPlanarEdge.js";
import populate from "rabbit-ear/graph/populate.js";
import { join as Join } from "rabbit-ear/graph/join.js";
import { boundingBox } from "rabbit-ear/math/polygon.js";
import { get } from "svelte/store";
import { NewEdgeAssignment } from "../../stores/App.js";
import { UpdateFrame } from "../../stores/Model.js";
import { CreasePattern } from "../../stores/ModelCP.js";
import { setEdgesAssignment } from "../../js/graph.js";

/**
 *
 */
export const vertex = (coords) => {
	const graph = get(CreasePattern);
	const vertex = AddVertex(graph, coords);
	UpdateFrame({ ...graph });
	return vertex;
};

/**
 * @param {number[][]} segment two points, each point being an array of numbers.
 */
export const segment = ([pointA, pointB]) => {
	const graph = get(CreasePattern);
	const vertex0 = AddVertex(graph, pointA);
	const vertex1 = AddVertex(graph, pointB);
	const edge = addNonPlanarEdge(graph, [vertex0, vertex1]);
	setEdgesAssignment(graph, [edge], get(NewEdgeAssignment));
	UpdateFrame({ ...graph });
	return edge;
};

/**
 *
 */
export const segments = (segs, assignments, foldAngles) => {
	const graph = get(CreasePattern);
	const vertices = AddVertices(segs.flat());

	const vertex0 = AddVertex(graph, coords0);
	const vertex1 = AddVertex(graph, coords1);
	const edge = addNonPlanarEdge(graph, [vertex0, vertex1]);
	setEdgesAssignment(graph, [edge], get(NewEdgeAssignment));
	UpdateFrame({ ...graph });
	return edge;
};

/**
 *
 */
export const edge = (vertexA, vertexB) => {
	const g = get(CreasePattern);
	const e = addNonPlanarEdge(g, [vertexA, vertexB]);
	setEdgesAssignment(g, [e], get(NewEdgeAssignment));
	UpdateFrame({ ...g });
	return e;
};

/**
 *
 */
export const line = (l) => {
	const graph = get(CreasePattern);
	const result = addPlanarLine(graph, l);
	UpdateFrame({ ...graph });
	return result;
};

/**
 *
 */
export const polyline = (poly) => {
	const graph = get(CreasePattern);
	const vertices = poly.map(point => AddVertex(graph, point));
	const edges = Array.from(Array(vertices.length - 1))
		.map((_, i) => i)
		.map(i => addNonPlanarEdge(graph, [vertices[i], vertices[i + 1]]));
	setEdgesAssignment(graph, edges, get(NewEdgeAssignment));
	UpdateFrame({ ...graph });
	return edges;
};

/**
 * @description an axis-aligned rectangle will be fit to include the
 * pair of points, and 4 segments will be added to the graph.
 * The two points can be in any arrangement.
 * @param {number[]} pointA a 2D point as an array of numbers
 * @param {number[]} pointB a 2D point as an array of numbers
 * @returns {number[]} a list of new edge indices
 */
export const rect = (pointA, pointB) => {
	const box = boundingBox([pointA, pointB]);
	if (box === undefined || (box.span[0] < 1e-3 && box.span[1] < 1e-3)) {
		return;
	}
	return polyline([
		[box.min[0], box.min[1]],
		[box.min[0], box.max[1]],
		[box.max[0], box.max[1]],
		[box.max[0], box.min[1]],
		[box.min[0], box.min[1]],
	]);
};

export const join = (graph) => {
	const cp = get(CreasePattern);
	// const cp = structuredClone(get(CreasePattern));
	Join(cp, graph);
	populate(cp);
	UpdateFrame({ ...cp });
};
