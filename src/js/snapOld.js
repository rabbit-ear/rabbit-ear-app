/**
 * Rabbit Ear (c) Kraft
 */
import { get } from "svelte/store";
import { distance2, subtract2 } from "rabbit-ear/math/vector.js";
import { clampLine, clampRay, clampSegment } from "rabbit-ear/math/line.js";
import { nearestPointOnLine } from "rabbit-ear/math/nearest.js";
import { overlapLinePoint } from "rabbit-ear/math/overlap.js";
import {
	nearestVertex as reNearestVertex,
	nearestEdge as reNearestEdge,
	nearestFace as reNearestFace,
} from "rabbit-ear/graph/nearest.js";
import { CreasePattern } from "../stores/ModelCP.js";
import { RulersCP } from "../stores/Ruler.js";
import { SnapPointsCP, SnapRadiusCP } from "../stores/Snap.js";
// import { Snapping } from "../stores/App.js";

const nearestGridPoint = (point, snapRadius) => {
	// if hex grid, check nearest hex grid point
	// square grid:
	const coords = point.map((n) => Math.round(n));
	const isNear = point
		.map((n, i) => Math.abs(coords[i] - n))
		.map((d) => d < snapRadius)
		.reduce((a, b) => a && b, true);
	return isNear ? coords : undefined;
};

// export const nearestVertex = (point) => reNearestVertex(get(CreasePattern), point);
// export const nearestEdge = (point) => reNearestEdge(get(CreasePattern), point);
// export const nearestFace = (point) => reNearestFace(get(CreasePattern), point);

export const snapToVertex = (point, force = false) => {
	if (!point) {
		return { vertex: undefined, coords: undefined };
	}
	const vertices = get(CreasePattern).vertices_coords || [];
	if (!vertices.length) {
		return { vertex: undefined, coords: undefined };
	}
	const distances = vertices.map((p) => distance2(p, point));
	let index = 0;
	for (let i = 1; i < distances.length; i += 1) {
		if (distances[i] < distances[index]) {
			index = i;
		}
	}
	return force || distances[index] < get(SnapRadiusCP)
		? { vertex: index, coords: vertices[index] }
		: { vertex: undefined, coords: undefined };
};

export const snapToEdge = (point, force = false) => {
	if (!point) {
		return { edge: undefined, coords: undefined };
	}
	const graph = get(CreasePattern);
	const edge = reNearestEdge(graph, point);
	if (edge === undefined) {
		return { edge: undefined, coords: point };
	}
	const seg = graph.edges_vertices[edge].map((v) => graph.vertices_coords[v]);
	const nearestPoint = nearestPointOnLine(
		{ vector: subtract2(seg[1], seg[0]), origin: seg[0] },
		point,
		clampSegment,
	);
	const distance = distance2(point, nearestPoint);
	return force || distance < get(SnapRadiusCP)
		? { edge, coords: nearestPoint }
		: { edge: undefined, coords: point };
};
/**
 * @description The most robust case is when the CP is very large,
 * imagine 50 snap points are closer to the pointer, closer than
 * the nearest graph vertex, but still, the graph vertex is within
 * the snapRadius, we want to snap to the graph vertex.
 */
export const snapOldToPoint = (point, force = false) => {
	if (!point) {
		return undefined;
	}
	const snapRadius = get(SnapRadiusCP);
	// these points take priority over grid points.
	const points = get(SnapPointsCP);
	const pointsDistance = points.map((p) => distance2(p, point));
	const nearestPointIndex = pointsDistance
		.map((d, i) => (d < snapRadius ? i : undefined))
		.filter((a) => a !== undefined)
		.sort((a, b) => pointsDistance[a] - pointsDistance[b])
		.shift();
	// if a point exists within our snap radius, use that
	if (nearestPointIndex !== undefined) {
		return [...points[nearestPointIndex]];
	}
	// fallback, use a grid point if it exists.
	// we only need the nearest of the grid coordinates.
	const grid = nearestGridPoint(point, snapRadius);
	if (grid !== undefined) {
		return grid;
	}
	// const gridDistance = grid === undefined
	// 	? Infinity
	// 	: distance2(point, grid);
	// fallback, return the input point.
	return [...point];
};

export const snapOldToPointWithInfo = (point, force = false) => {
	if (!point) {
		return { snap: false, coord: undefined };
	}
	const snapRadius = get(SnapRadiusCP);
	// these points take priority over grid points.
	const points = get(SnapPointsCP);
	const pointsDistance = points.map((p) => distance2(p, point));
	const nearestPointIndex = pointsDistance
		.map((d, i) => (d < snapRadius ? i : undefined))
		.filter((a) => a !== undefined)
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

// const isPointOnLine = (point, lines) => {
// 	for (let i = 0; i < lines.length; i += 1) {
// 		const line = lines[i];
// 		const near = nearestPointOnLine(line, point);
// 		if (distance2(near, point) < 1e-3) { return true; }
// 	}
// 	return false;
// };

// const isPointOnALine = (point, lines) => {
// 	for (let i = 0; i < lines.length; i += 1) {
// 		const line = lines[i];
// 		const near = nearestPointOnLine(line, point);
// 		if (distance2(near, point) < 1e-3) { return true; }
// 	}
// 	return false;
// };

export const snapOldToRulerLine = (point) => {
	if (!point) {
		return { index: undefined, line: undefined, coords: undefined };
	}
	const rulers = get(RulersCP);
	// const rulerLines = get(RulerLines);
	// const rulerRays = get(RulerRays);
	// lines and rays in the same array, with a "type" key.
	// const lineTypes = rulerLines
	// 	.map(geo => ({ type: "line", geo }))
	// 	.concat(rulerRays.map(geo => ({ type: "ray", geo })));
	if (!rulers.length) {
		return {
			index: undefined,
			line: undefined,
			coords: snapOldToPoint(point, false),
		};
	}
	const rulerLinesNearPoints = rulers.map((el) =>
		nearestPointOnLine(el.line, point, el.clamp),
	);
	const distances = rulerLinesNearPoints.map((p) => distance2(point, p));
	let index = 0;
	for (let i = 1; i < distances.length; i += 1) {
		if (distances[i] < distances[index]) {
			index = i;
		}
	}
	const rulerPoint = rulerLinesNearPoints[index];
	const snapPoint = snapOldToPoint(rulerPoint, false);
	return overlapLinePoint(rulers[index].line, snapPoint)
		? { index, line: rulers[index].line, coords: snapPoint }
		: { index, line: rulers[index].line, coords: rulerPoint };
};

// export const snapOldToPoint = (point, force = false) => {
// 	const snapRadius = get(SnapRadiusCP);
// 	// all the snap points
// 	const gridCoord = get(Snapping)
// 		? nearestGridPoint(point, snapRadius)
// 		: undefined;
// 	if (gridCoord !== undefined) { return gridCoord; }
// 	const { vertex, coords } = snapToVertex(point, force);
// 	const vertexDistance = (vertex === undefined
// 		? Infinity
// 		: distance2(point, coords));
// 	const points = get(SnapPointsCP);
// 	const distances = points.map(p => distance2(p, point));
// 	const index = distances
// 		.map((d, i) => d < snapRadius ? i : undefined)
// 		.filter(a => a !== undefined)
// 		.sort((a, b) => distances[a] - distances[b])
// 		.shift();
// 	const snapDistance = (index === undefined
// 		? Infinity
// 		: distances[index]);
// 	return index === undefined
// 		? [...point]
// 		: [...points[index]];
// };
