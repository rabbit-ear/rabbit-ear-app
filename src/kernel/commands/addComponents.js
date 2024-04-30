import {
	addVertex as AddVertex,
	addVertices as AddVertices,
} from "rabbit-ear/graph/add/vertex.js";
// import addPlanarLine from "rabbit-ear/graph/add/addPlanarLine.js";
import {
	addEdge,
} from "rabbit-ear/graph/add/edge.js";
import { populate } from "rabbit-ear/graph/populate.js";
import { planarize as Planarize } from "rabbit-ear/graph/planarize.js";
import { makeEdgesCoords } from "rabbit-ear/graph/make/edges.js";
import { join as Join } from "rabbit-ear/graph/join.js";
import { boundingBox } from "rabbit-ear/math/polygon.js";
import { get } from "svelte/store";
import { NewEdgeAssignment } from "../../stores/App.js";
import { UpdateFrame } from "../../stores/Model.js";
import { CreasePattern } from "../../stores/ModelCP.js";
import { FoldedForm } from "../../stores/ModelFolded.js";
import { setEdgesAssignment } from "../../js/graph.js";
import { splitLineIntoEdges } from "rabbit-ear/graph/split/splitLine.js";
import {
	transferPointInFaceBetweenGraphs,
	// transferPointOnEdgeBetweenGraphs,
} from "rabbit-ear/graph/transfer.js";
import { mergeArraysWithHoles } from "rabbit-ear/general/array.js";

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
 * @param {[number, number][]} segment two points, each point being an array of numbers.
 */
export const segment = ([pointA, pointB]) => {
	const graph = get(CreasePattern);
	const vertex0 = AddVertex(graph, pointA);
	const vertex1 = AddVertex(graph, pointB);
	const edge = addEdge(graph, [vertex0, vertex1]);
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
	const edge = addEdge(graph, [vertex0, vertex1]);
	setEdgesAssignment(graph, [edge], get(NewEdgeAssignment));
	UpdateFrame({ ...graph });
	return edge;
};

/**
 *
 */
export const edge = (vertexA, vertexB) => {
	const g = get(CreasePattern);
	const e = addEdge(g, [vertexA, vertexB]);
	setEdgesAssignment(g, [e], get(NewEdgeAssignment));
	UpdateFrame({ ...g });
	return e;
};

/**
 *
 */
export const line = (l) => {
	// const graph = get(CreasePattern);
	// const result = addPlanarLine(graph, l);
	// UpdateFrame({ ...graph });
	// return result;
	return [];
};

/**
 *
 */
export const polyline = (poly) => {
	const graph = get(CreasePattern);
	const vertices = poly.map(point => AddVertex(graph, point));
	const edges = Array.from(Array(vertices.length - 1))
		.map((_, i) => i)
		.map(i => addEdge(graph, [vertices[i], vertices[i + 1]]));
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

export const joinCP = (graph) => {
	const cp = get(CreasePattern);
	Join(cp, graph);
	populate(cp, { faces: true });
	UpdateFrame({ ...cp });
};

export const joinFolded = (graph) => {
	const cp = get(CreasePattern);
	Join(cp, graph);
	populate(cp, { faces: true });
	UpdateFrame({ ...cp });
};

export const graphSegments = (graph) => [
	makeEdgesCoords(graph),
	graph.edges_assignment ? graph.edges_assignment : [],
	graph.edges_foldAngle ? graph.edges_foldAngle : [],
];

/**
 *
 */
export const segmentsFolded = (segments, assignments, foldAngles) => {
	// todo need to expose these options to the user
	const newAssignment = "F";
	const newFoldAngle = 0;

	const folded = get(FoldedForm);
	const cp = get(CreasePattern);

	const allNewSegments = segments.flatMap(segment => {
		// const {
		// 	vertices,
		// 	edges_vertices,
		// 	collinear_edges,
		// } = splitSegmentWithGraph(folded, segment);
		const {
			vertices,
			edges_vertices,
			edges_collinear,
			edges_face,
		} = splitLineIntoEdges(
			folded,
			pointsToLine(...segment),
			includeS,
			segment,
		);

		const vertices_coords = vertices.map(el => el.point);

		// const edges_assignment = edges_vertices.map(() => newAssignment);
		// const edges_foldAngle = edges_vertices.map(() => newFoldAngle);

		// splitSegmentWithGraph created new points in the foldedForm coordinate
		// space. we need to transfer these to their respective position in the
		// crease pattern space. 2 different methods depending on how the point was made
		vertices.forEach((overlapInfo, v) => {
			if (overlapInfo.face !== undefined) {
				vertices_coords[v] = transferPointInFaceBetweenGraphs(
					folded,
					cp,
					overlapInfo.face,
					overlapInfo.point,
				);
			}
			if (overlapInfo.edge !== undefined) {
				vertices_coords[v] = transferPointOnEdgeBetweenGraphs(
					cp,
					overlapInfo.edge,
					overlapInfo.a,
				);
			}
		});

		const newGraph = {
			vertices_coords: mergeArraysWithHoles(cp.vertices_coords, vertices_coords),
			edges_vertices,
			// edges_vertices: mergeArraysWithHoles(cp.edges_vertices, edges_vertices),
			// edges_assignment: mergeArraysWithHoles(cp.edges_assignment, edges_assignment),
			// edges_foldAngle: mergeArraysWithHoles(cp.edges_foldAngle, edges_foldAngle),
		};
		// console.log("new graph", newGraph);
		return makeEdgesCoords(newGraph).filter(a => a);
	});

	// console.log("allNewSegments", allNewSegments);

	const newGraph = {};
	const edges = allNewSegments.forEach(segment => {
		// console.log("HERE", segment[0], segment[1])
		const vertex0 = AddVertex(newGraph, segment[0]);
		const vertex1 = AddVertex(newGraph, segment[1]);
		const edge = addEdge(newGraph, [vertex0, vertex1]);
		setEdgesAssignment(newGraph, [edge], newAssignment);
	});

	// console.log("newGraph", newGraph);
	Join(cp, newGraph)
	// const result = Planarize(cp);
	// populate(result, { faces: true });
	// console.log("HERE", structuredClone(result));
	// UpdateFrame({ ...result });

	// const result = populate(Planarize(cp), { faces: true });
	UpdateFrame({ ...cp });


	// console.log("FOLDED RESULT",
	// 	vertices_coords,
	// 	vertices,
	// 	edges_vertices,
	// 	collinear_edges);


	// // this should be a bit smarter. if the user is creasing M/Vs, we need to
	// // set M/V if the existing assignment is "F" or "U".
	// // if we are creasing "F", this should be commented out.
	// // collinear_edges.forEach(e => cp.edges_assignment[e] = newAssignment);
	// // collinear_edges.forEach(e => cp.edges_foldAngle[e] = newFoldAngle);
	// UpdateFrame({ ...cp });
};
