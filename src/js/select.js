import { includeS } from "rabbit-ear/math/compare.js";
import { intersectLineLine } from "rabbit-ear/math/intersect.js";
import {
	nearestVertex,
	nearestEdge,
	nearestFace,
} from "rabbit-ear/graph/nearest.js";
/**
 *
 */
const pointInRect = (p, rect) =>
	p[0] > rect.min[0] &&
	p[0] < rect.max[0] &&
	p[1] > rect.min[1] &&
	p[1] < rect.max[1];
/**
 *
 */
const segmentBoxOverlap = (segment, box) => {
	const boxSegments = [
		[box.min, [box.max[0], box.min[1]]],
		[[box.max[0], box.min[1]], box.max],
		[box.max, [box.min[0], box.max[1]]],
		[[box.min[0], box.max[1]], box.min],
	];
	const line = {
		vector: [segment[1][0] - segment[0][0], segment[1][1] - segment[0][1]],
		origin: segment[0],
	};
	const boxVectors = boxSegments.map((seg) => [
		seg[1][0] - seg[0][0],
		seg[1][1] - seg[0][1],
	]);
	const boxLines = boxVectors.map((vector, i) => ({
		vector,
		origin: boxSegments[i][0],
	}));
	const segmentIntersects = boxSegments.map(
		(seg, i) => intersectLineLine(line, boxLines[i], includeS, includeS).point,
	);
	const anySegmentIntersects = segmentIntersects.reduce(
		(a, b) => a || b,
		false,
	);
	if (anySegmentIntersects) {
		return true;
	}
	const ptInside = pointInRect(segment[0], box);
	return ptInside;
};

/**
 *
 */
export const getComponentsNearPoint = (graph, point) => ({
	vertices: [nearestVertex(graph, point)],
	edges: [nearestEdge(graph, point)],
	faces: [nearestFace(graph, point)],
});

/**
 *
 */
export const getComponentsInsideRect = (graph, rect) => {
	if (!graph || !rect) {
		return { vertices: [], edges: [], faces: [] };
	}
	if (
		!graph.vertices_coords ||
		!graph.edges_vertices ||
		(!graph.faces_vertices && !graph.faces_edges)
	) {
		return { vertices: [], edges: [], faces: [] };
	}
	const verticesLookup = graph.vertices_coords.map((p) => pointInRect(p, rect));
	const vertices = verticesLookup
		.map((sel, i) => (sel ? i : undefined))
		.filter((a) => a !== undefined);
	const edgesLookup = graph.edges_vertices
		.map((ev) => ev.map((v) => graph.vertices_coords[v]))
		.map((segment) => segmentBoxOverlap(segment, rect));
	const edges = edgesLookup
		.map((sel, i) => (sel ? i : undefined))
		.filter((a) => a !== undefined);
	const faces = graph.faces_edges
		? graph.faces_edges
				.map((fe) => fe.map((e) => edgesLookup[e]))
				.map((face) => face.reduce((a, b) => a || b, false))
				.map((sel, i) => (sel ? i : undefined))
				.filter((a) => a !== undefined)
		: graph.faces_vertices
				// const faces = graph.faces_vertices
				.map((fv) => fv.map((v) => verticesLookup[v]))
				.map((face) => face.reduce((a, b) => a || b, false))
				.map((sel, i) => (sel ? i : undefined))
				.filter((a) => a !== undefined);
	return { vertices, edges, faces };
};
/**
 * @description Given a selection object, which contains selected vertices
 * and/or edges and/or faces, return a list of all selected vertices, meaning,
 * in the case of edges and faces, include all the vertices that are
 * a member of these components.
 */
export const getInclusiveVertices = (
	{ edges_vertices, faces_vertices },
	selection = {},
) => {
	const vertexHash = {};
	if (selection.vertices) {
		selection.vertices.forEach((v) => {
			vertexHash[v] = true;
		});
	}
	if (selection.edges && edges_vertices) {
		selection.edges.forEach((e) =>
			edges_vertices[e].forEach((v) => {
				vertexHash[v] = true;
			}),
		);
	}
	if (selection.faces && faces_vertices) {
		selection.faces.forEach((e) =>
			faces_vertices[e].forEach((v) => {
				vertexHash[v] = true;
			}),
		);
	}
	return Object.keys(vertexHash).map((n) => parseInt(n, 10));
};
