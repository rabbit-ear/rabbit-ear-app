import { get } from "svelte/store";
import { distance2 } from "rabbit-ear/math/algebra/vector.js";
import { Graph } from "../stores/Graph.js";
import { ViewBox } from "../stores/ViewBox.js";
import { SnapPoints } from "../stores/Snap.js";

export const getNearestPoint = (point) => {
	const g = get(Graph);
	// iterate through vertices of the graph.
	// find the nearest match. save the index of the vertex also.
	//
	// snap points will always be 1...n vertices of the graph
	// plus an additional set. we can start at this index and search
	// the additional points to find an even closer match.
};

/**
 * @returns {object} object with "coords" and "vertex". coords will
 * always contain a point, vertex can be undefined. vertex will be
 * an integer if the coordinate is also an existing vertex in the graph.
 * otherwise snapping can still occur for example snapping to the grid.
 */
export const getSnapPoint = (point) => {
	// get the touch epsilon
	const vb = get(ViewBox);
	const vmax = Math.max(vb[2], vb[3]);
	const touchEpsilon = vmax * 0.05;
	// all the snap points
	const points = get(SnapPoints);
	const distances = points.map(p => distance2(p, point));
	const snapPointIndex = distances
		.map((d, i) => d < touchEpsilon ? i : undefined)
		.filter(a => a !== undefined)
		.sort((a, b) => distances[a] - distances[b])
		.shift();
	// no matching snap point
	if (snapPointIndex === undefined) {
		return { coords: [...point], vertex: undefined };
	}
	const coords = [...points[snapPointIndex]];
	// todo:
	// redundant work. is the coord in the graph's vertices_coords?
	const g = get(Graph);
	for (let i = 0; i < g.vertices_coords.length; i += 1) {
		if (distance2(g.vertices_coords[i], coords) < 1e-6) {
			return { coords, vertex: i };
		}
	}
	return { coords, vertex: undefined };
};

// export const didTouchVertex = (point) => {
// 	const vb = get(ViewBox);
// 	const vmax = Math.max(vb[2], vb[3]);
// 	const touchEpsilon = vmax * 0.05;
// 	const distances = get(graph).vertices_coords
// 		.map(p => distance2(p, point));
// 	return distances
// 		.map((d, i) => d < touchEpsilon ? i : undefined)
// 		.filter(a => a !== undefined)
// 		.sort((a, b) => distances[a] - distances[b])
// 		.shift();
// };
