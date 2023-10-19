import { get } from "svelte/store";
import { distance2 } from "rabbit-ear/math/vector.js";
import {
	clampLine,
	clampRay,
	clampSegment,
} from "rabbit-ear/math/line.js";
import { nearestPointOnLine } from "rabbit-ear/math/nearest.js";
import { overlapLinePoint } from "rabbit-ear/math/overlap.js";
import {
	RulerLines,
	RulerRays,
} from "../stores/Ruler.js";

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
export const snapToPointNew = (point, points, snapRadius) => {
	if (!point) { return { snap: false, coord: undefined }; }
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



export const snapToRulerLine = (point) => {
	if (!point) {
		return { index: undefined, line: undefined, coords: undefined };
	}
	const rulerLines = get(RulerLines);
	const rulerRays = get(RulerRays);
	// lines and rays in the same array, with a "type" key.
	const lineTypes = rulerLines
		.map(geo => ({ type: "line", geo }))
		.concat(rulerRays.map(geo => ({ type: "ray", geo })));
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
