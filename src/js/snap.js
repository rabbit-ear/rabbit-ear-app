import { get } from "svelte/store";
import { distance2 } from "rabbit-ear/math/algebra/vector.js";
import { ViewBox } from "../stores/ViewBox.js";
import { SnapPoints } from "../stores/Snap.js";
import { Snapping } from "../stores/App.js";

const getSnapRadius = () => {
	const vb = get(ViewBox);
	const vmax = Math.max(vb[2], vb[3]);
	return vmax * 0.05;
};

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

// export const snapToVertex = (point) => {}

// export const snapToGrid = (point, force = false) => {};

export const snapToPoint = (point, force = false) => {
	const snapRadius = getSnapRadius();
	// all the snap points
	const gridCoord = get(Snapping)
		? nearestGridPoint(point, snapRadius)
		: undefined;
	if (gridCoord !== undefined) { return gridCoord; }
	const points = get(SnapPoints);
	const distances = points.map(p => distance2(p, point));
	const snapPointIndex = distances
		.map((d, i) => d < snapRadius ? i : undefined)
		.filter(a => a !== undefined)
		.sort((a, b) => distances[a] - distances[b])
		.shift();
	return snapPointIndex === undefined
		? [...point]
		: [...points[snapPointIndex]];
};

export const snapToPointOrRulerLine = (point, force = false) => {

};

export const snapToRulerLine = (point, force = false) => {

};
