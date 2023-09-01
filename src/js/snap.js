/**
 * Rabbit Ear (c) Kraft
 */
import { get } from "svelte/store";
import {
	distance2,
	subtract2,
} from "rabbit-ear/math/vector.js";
import {
	clampLine,
	clampRay,
	clampSegment,
} from "rabbit-ear/math/line.js";
import { nearestPointOnLine } from "rabbit-ear/math/nearest.js";
import { overlapLinePoint } from "rabbit-ear/math/overlap.js";
import {
	nearest,
	nearestVertex as reNearestVertex,
	nearestEdge as reNearestEdge,
	nearestFace as reNearestFace,
} from "rabbit-ear/graph/nearest.js";
import { ViewBox } from "../stores/ViewBox.js";
import {
	SnapPoints,
	SnapRadius,
} from "../stores/Snap.js";
import { Graph } from "../stores/Model.js";
import {
	RulerPoints,
	RulerLines,
	RulerRays,
} from "../stores/Ruler.js";
import { Snapping } from "../stores/App.js";

// todo: for large crease patterns, this is overwriting the
// intended behavior. grid resolution needs to be dependent
// on the viewbox zoom, fractions of a unit need to be ignored.
const nearestGridPoint = (point, snapRadius) => {
	// if hex grid, check nearest hex grid point
	// square grid:
	const coords = point.map(n => Math.round(n));
	const isNear = point
		.map((n, i) => Math.abs(coords[i] - n))
		.map(d => d < snapRadius)
		.reduce((a, b) => a && b, true);
	return isNear ? coords : undefined
};

// export const nearestVertex = (point) => reNearestVertex(get(Graph), point);
// export const nearestEdge = (point) => reNearestEdge(get(Graph), point);
// export const nearestFace = (point) => reNearestFace(get(Graph), point);

export const snapToVertex = (point, force = false) => {
	const vertices = get(Graph).vertices_coords || [];
	if (!vertices.length) { return { vertex: undefined, coords: point }; }
	const distances = vertices.map(p => distance2(p, point));
	let index = 0;
	for (let i = 1; i < distances.length; i += 1) {
		if (distances[i] < distances[index]) { index = i; }
	}
	return force || distances[index] < get(SnapRadius)
		? { vertex: index, coords: vertices[index] }
		: { vertex: undefined, coords: point };
};

export const snapToEdge = (point, force = false) => {
	const graph = get(Graph);
	const edge = reNearestEdge(graph, point);
	if (edge === undefined) { return { edge: undefined, coords: point}; }
	const seg = graph.edges_vertices[edge].map(v => graph.vertices_coords[v]);
	const nearestPoint = nearestPointOnLine(
		{ vector: subtract2(seg[1], seg[0]), origin: seg[0] },
		point,
		clampSegment,
	);
	const distance = distance2(point, nearestPoint);
	return force || distance < get(SnapRadius)
		? { edge, coords: nearestPoint }
		: { edge: undefined, coords: point };
};

export const snapToPoint = (point, force = false) => {
	const snapRadius = get(SnapRadius);
	// all the snap points
	const gridCoord = get(Snapping)
		? nearestGridPoint(point, snapRadius)
		: undefined;
	// const gridCoordDist = gridCoord === undefined
	// 	? Infinity
	// 	: distance2(point, gridCoord);
	// if (gridCoord !== undefined) { return gridCoord; }
	const points = gridCoord === undefined
		? get(SnapPoints)
		: [...get(SnapPoints), gridCoord];
	// if (gridCoord !== undefined) { points.push(gridCoord); }
	const distances = points.map(p => distance2(p, point));
	const index = distances
		.map((d, i) => d < snapRadius ? i : undefined)
		.filter(a => a !== undefined)
		.sort((a, b) => distances[a] - distances[b])
		.shift();
	return index === undefined
		? [...point]
		: [...points[index]];
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

export const snapToRulerLine = (point) => {
	const rulerLines = get(RulerLines);
	const rulerRays = get(RulerRays);
	// lines and rays in the same array, with a "type" key.
	const lineTypes = rulerLines
		.map(geo => ({ type: "line", geo }))
		.concat(rulerRays.map(geo => ({ type: "ray", geo })))
	if (!lineTypes.length) {
		return { index: undefined, line: undefined, coords: snapToPoint(point, false) };
	}
	const rulerLinesNearPoints = lineTypes
		.map(el => nearestPointOnLine(el.geo, point, el.type === "ray" ? clampRay : clampLine));
	const distances = rulerLinesNearPoints
		.map(p => distance2(point, p));
	let index = 0;
	for (let i = 1; i < distances.length; i += 1) {
		if (distances[i] < distances[index]) { index = i; }
	}
	const rulerPoint = rulerLinesNearPoints[index];
	const snapPoint = snapToPoint(rulerPoint, false);
	return overlapLinePoint(lineTypes[index].geo, snapPoint)
		? { index, line: lineTypes[index].geo, coords: snapPoint }
		: { index, line: lineTypes[index].geo, coords: rulerPoint };
};

// export const snapToPoint = (point, force = false) => {
// 	const snapRadius = get(SnapRadius);
// 	// all the snap points
// 	const gridCoord = get(Snapping)
// 		? nearestGridPoint(point, snapRadius)
// 		: undefined;
// 	if (gridCoord !== undefined) { return gridCoord; }
// 	const { vertex, coords } = snapToVertex(point, force);
// 	const vertexDistance = (vertex === undefined
// 		? Infinity
// 		: distance2(point, coords));
// 	const points = get(SnapPoints);
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
