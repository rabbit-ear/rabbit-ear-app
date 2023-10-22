import { get } from "svelte/store";
import {
	CreasePattern,
	FoldedForm,
	UpdateFrame,
} from "../../stores/Model.js";
import repeatFold from "rabbit-ear/graph/flatFold/repeatFold.js";
import {
	add,
	scale,
	subtract2,
	scale2,
	distance2,
	dot2,
	magnitude2,
	add2,
} from "rabbit-ear/math/vector.js";
import { overlapConvexPolygonPointNew } from "rabbit-ear/math/overlap.js";
import { makeFacesPolygonQuick } from "rabbit-ear/graph/make.js";
import { edgeAssignmentToFoldAngle } from "rabbit-ear/fold/spec.js";
import { UIGraph } from "../../stores/UI.js";
import { intersectGraphSegment } from "rabbit-ear/graph/intersect.js";
import { pointsToLine } from "rabbit-ear/math/convert.js";
/**
 * @description Given a point has known distances to three triangle points,
 * and given the location of that triangle's points in space, find the
 * real location of the point in space.
 * https://stackoverflow.com/questions/9747227/2d-trilateration
 * @param {number[][]} three 2D triangle points
 * @param {number[]} three distances to each of the triangle points
 * @returns {number[]} the 2D location of the point inside the triangle.
 */
const trilateration = (pts, radii) => {
	if (pts.length !== 3 || (pts[0] === undefined || pts[1] === undefined || pts[2] === undefined)) {
		return;
	}
	const ex = scale2(subtract2(pts[1], pts[0]), 1 / distance2(pts[1], pts[0]));
	const i = dot2(ex, subtract2(pts[2], pts[0]));
	const exi = scale2(ex, i);
	const p2p0exi = subtract2(subtract2(pts[2], pts[0]), exi);
	const ey = scale2(p2p0exi, (1 / magnitude2(p2p0exi)));
	const d = distance2(pts[1], pts[0]);
	const j = dot2(ey, subtract2(pts[2], pts[0]));
	const x = ((radii[0] ** 2) - (radii[1] ** 2) + (d ** 2)) / (2 * d);
	const y = ((radii[0] ** 2) - (radii[2] ** 2) + (i ** 2) + (j ** 2)) / (2 * j) - ((i * x) / j);
	return add2(add2(pts[0], scale2(ex,x)), scale2(ey,y));
};

export const foldedLine = (a, b) => {
	const line = { vector: subtract2(b, a), origin: a };
	try {
		const graph = get(CreasePattern);
		const result = repeatFold(graph, line, "V")
			.filter(a => a !== undefined);
		const vertCount = graph.vertices_coords.length;
		graph.vertices_coords.push(...result.flatMap(el => el.points));
		graph.edges_vertices.push(...result
			.map((_, i) => [vertCount + i * 2, vertCount + i * 2 + 1]));
		graph.edges_assignment.push(...result.map(el => el.assignment));
		graph.edges_foldAngle.push(...result
			.map(el => el.assignment)
			.map(a => edgeAssignmentToFoldAngle(a)));
		UpdateFrame({ ...graph });
	} catch (error) {
		console.error(error);
	}
};

export const foldedLinePreview = (a, b) => {
	const line = { vector: subtract2(b, a), origin: a };
	// return repeatFold(get(CreasePattern), line, "V");
	try {
		const result = repeatFold(get(CreasePattern), line, "V")
			.filter(a => a !== undefined);
		// console.log("graph", {
		// 	vertices_coords: result.flatMap(el => el.points),
		// 	edges_vertices: result.map((_, i) => [i * 2, i * 2 + 1]),
		// });
		UIGraph.set({
			vertices_coords: result.flatMap(el => el.points),
			edges_vertices: result.map((_, i) => [i * 2, i * 2 + 1]),
		});
	} catch (error) {
		console.error(error);
	}
};
/**
 *
 */
const transferPointBetweenGraphs = (from, to, face, point) => {
	const faceVertices = from.faces_vertices[face];
	const fromPoly = faceVertices.map(v => from.vertices_coords[v]);
	const toPoly = faceVertices.map(v => to.vertices_coords[v]);
	const distances = fromPoly.map(p => distance2(p, point));
	return trilateration(toPoly, distances);
}
/**
 *
 */
export const foldedSegment = (pointA, pointB) => {
	const segment = [pointA, pointB];
	const folded = get(FoldedForm);
	const cp = get(CreasePattern);
	// information about the intersection between a segment and the folded form.
	const intersections = intersectGraphSegment(folded, segment);
	// console.log("intersections", intersections);
	// if there are any points that lie inside of faces, convert
	// them into their position in the crease pattern
	intersections.faces.forEach((faceInfo, f) => faceInfo.points.forEach(el => {
		el.cpPoint = transferPointBetweenGraphs(folded, cp, f, el.point);
	}));
	// add new vertices to the graph: middle of edge intersections,
	// and points that lie somewhere inside of a face.
	let vCount = folded.vertices_coords.length;
	const newEdgesNewVertex = intersections.edges.map(() => vCount++);
	intersections.faces.forEach((el, f) => el.points.forEach((_, i) => {
		intersections.faces[f].points[i].newIndex = vCount++;
	}));
	// append these vertices_coords to our crease pattern
	const vertices_coords = intersections.edges.map((el, e) => {
		const edgeSegment = cp.edges_vertices[e].map(v => cp.vertices_coords[v]);
		const edgeLine = pointsToLine(...edgeSegment);
		return add(edgeLine.origin, scale(edgeLine.vector, el.a));
	}).filter(a => a !== undefined);
	intersections.faces
		.forEach(info => info.points
			.forEach(el => { vertices_coords.push(el.cpPoint); }));
	// append these edges_vertices to our crease pattern
	const edges_vertices = intersections.faces
		.map(({ edges, vertices, points }) => {
			const newVerticesEdgesMap = edges.map(e => newEdgesNewVertex[e]);
			const newVerticesPointsMap = points.map(el => el.newIndex);
			// guaranteed to be length 2.
			// console.log("length 2", newVerticesEdgesMap.concat(newVerticesPointsMap).concat(vertices));
			return newVerticesEdgesMap.concat(newVerticesPointsMap).concat(vertices);
		}).filter(a => a !== undefined);

	const assignments = edges_vertices.map(() => "F");
	const foldAngles = edges_vertices.map(() => 0);
	cp.vertices_coords.push(...vertices_coords);
	cp.edges_vertices.push(...edges_vertices);
	cp.edges_assignment.push(...assignments);
	cp.edges_foldAngle.push(...foldAngles);
	intersections.edges_overlapped.forEach(e => cp.edges_assignment[e] = "F");
	intersections.edges_overlapped.forEach(e => cp.edges_foldAngle[e] = 0);
	// console.log("cp", structuredClone(cp));
	UpdateFrame({ ...cp });
};
