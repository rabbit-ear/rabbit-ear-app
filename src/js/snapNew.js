import {
	distance2,
	subtract2,
} from "rabbit-ear/math/vector.js";
import {
	clampSegment,
} from "rabbit-ear/math/line.js";
import { nearestPointOnLine } from "rabbit-ear/math/nearest.js";
import { overlapLinePoint } from "rabbit-ear/math/overlap.js";
import {
	nearest,
	nearestVertex,
	nearestEdge,
	nearestFace,
} from "rabbit-ear/graph/nearest.js";

// todo: hex grid, check nearest hex grid point
const nearestGridPoint = (point, snapRadius) => {
	const coords = point.map(n => Math.round(n));
	const isNear = point
		.map((n, i) => Math.abs(coords[i] - n))
		.map(d => d < snapRadius)
		.reduce((a, b) => a && b, true);
	return isNear ? coords : undefined
};
/**
 * @description Snap a point to either one point from a list of points
 * or to a grid-line point if either is within the range specified
 * by a snap radius.
 * @param {number[]} point the point we want to snap
 * @param {number[][]} points a list of snap points to test against
 * @param {number} snapRadius the epsilon range, any points outside
 * this will be ignored.
 * @returns {object} object with coords {number[]} and snap {boolean}
 */
export const snapToPoint = (point, points, snapRadius) => {
	// console.log("snapToPoint", point, points, snapRadius);
	if (!point) { return { coord: undefined, snap: false }; }
	if (!points || !points.length) { return { coord: point, snap: false }; }
	// these points take priority over grid points.
	const pointsDistance = points.map(p => distance2(p, point));
	const nearestPointIndex = pointsDistance
		.map((d, i) => d < snapRadius ? i : undefined)
		.filter(a => a !== undefined)
		.sort((a, b) => pointsDistance[a] - pointsDistance[b])
		.shift();
	// if a point exists within our snap radius, use that
	if (nearestPointIndex !== undefined) {
		return { coords: [...points[nearestPointIndex]], snap: true };
	}
	// fallback, use a grid point if it exists.
	// we only need the nearest of the grid coordinates.
	const grid = nearestGridPoint(point, snapRadius);
	if (grid !== undefined) {
		return { coords: grid, snap: true };
	}
	// fallback, return the input point.
	return { coords: [...point], snap: false };
};
/**
 * @param {number[]} point
 * @param {number[][]} points
 * @param { line: VecLine, clamp: function, domain: function } rulers
 * @param {number} snapRadius
 */
export const snapToRulerLine = (point, points, rulers, snapRadius) => {
	// console.log("snapToRulerLine", point, points, rulers, snapRadius);
	if (!point) {
		return { coords: undefined, snap: false };
	}
	if (!rulers || !rulers.length) {
		return { coords: point, snap: false };
	}
	// for each ruler, a point that is the nearest point on the line
	const rulersPoint = rulers
		.map(el => nearestPointOnLine(el.line, point, el.clamp));
	// for each ruler point, the distance to our input point
	const distances = rulersPoint.map(p => distance2(point, p));
	// find the nearest point
	let index = 0;
	for (let i = 1; i < distances.length; i += 1) {
		if (distances[i] < distances[index]) { index = i; }
	}
	const ruler = rulers[index];
	const rulerPoint = rulersPoint[index];
	// even if our goal is simply to snap to a ruler line, there may be a
	// snap point that lies along the nearest snapping ruler.
	// it's a snap within a snap behavior which, once you see, UX-wise,
	// it's a behavior that a user would expect to receive.
	// Now that we have found the nearest snap line, this is a subset of
	// snapPoints which overlap this snap line.
	const collinearSnapPoints = points
		.filter(p => overlapLinePoint(ruler.line, p, ruler.domain));
	const snapPoint = snapToPoint(rulerPoint, collinearSnapPoints, snapRadius);
	return snapPoint.snap
		? snapPoint
		: { coords: rulerPoint, snap: true };
};
/**
 * @param {number[]} point
 * @param {FOLD} graph a FOLD graph with vertices_coords, edges_vertices
 * @param {number} snapRadius
 */
export const snapToEdge = (point, graph, snapRadius) => {
	if (!point || !graph || !graph.vertices_coords || !graph.edges_vertices) {
		return { snap: false, edge: undefined, coords: undefined };
	}
	const edge = nearestEdge(graph, point);
	if (edge === undefined) {
		return { snap: false, edge: undefined, coords: point};
	}
	const seg = graph.edges_vertices[edge].map(v => graph.vertices_coords[v]);
	const nearestPoint = nearestPointOnLine(
		{ vector: subtract2(seg[1], seg[0]), origin: seg[0] },
		point,
		clampSegment,
	);
	const distance = distance2(point, nearestPoint);
	return distance < snapRadius
		? { snap: true, edge, coords: nearestPoint }
		: { snap: false, edge: undefined, coords: point };
};