import { get } from "svelte/store";
import { replace } from "rabbit-ear/graph/replace.js";
import { removeDuplicateVertices } from "rabbit-ear/graph/vertices/duplicate.js";
import { UpdateFrame } from "../../stores/Model.js";
import { CreasePattern } from "../../stores/ModelCP.js";
import { Precision, Sqrt2Lookup } from "../../stores/Sqrt2.js";
import { Selection } from "../../stores/Select.js";
import { findEpsilon, cleanNumber } from "../../js/epsilon.js";
import { nearestTwoVertices } from "../../js/errors.js";
/**
 *
 */
export const mergeNearbyVertices = (epsilonFactor = 1e-4) => {
	const graph = get(CreasePattern);
	const epsilon = findEpsilon(graph, epsilonFactor);
	const result = removeDuplicateVertices(graph, epsilon);
	return result.remove.length
		? `removed ${result.remove.length} vertices: [${result.remove.join(" ")}]`
		: undefined;
};
/**
 *
 */
export const cleanVertices = () => {
	const graph = get(CreasePattern);
	const lookup = get(Sqrt2Lookup);
	const precision = get(Precision);
	const vertices_coords = graph.vertices_coords.map((coord) =>
		coord.map((n) => cleanNumber(n, precision, lookup)),
	);
	const modified = graph.vertices_coords
		.flatMap((coord, i) =>
			coord.map((n, j) => (n === vertices_coords[i][j] ? 0 : 1)),
		)
		.reduce((a, b) => a + b, 0);
	UpdateFrame({ ...graph, vertices_coords });
	return modified
		? `repaired ${modified}/${vertices_coords.length * 2} numbers (in ${vertices_coords.length} vertices)`
		: undefined;
};
/**
 *
 */
export const snapAllVertices = () => {
	const graph = get(CreasePattern);
	const vertices_coords = graph.vertices_coords || [];
	vertices_coords.forEach((coord, i) =>
		coord.forEach((n, j) => {
			vertices_coords[i][j] = Math.round(n);
		}),
	);
	UpdateFrame({ ...graph, vertices_coords });
};
/**
 *
 */
export const selectNearestVertices = () => {
	const vertices = nearestTwoVertices(get(CreasePattern));
	if (vertices === undefined) {
		return;
	}
	Selection.reset();
	Selection.addVertices(vertices);
};
/**
 *
 */
export const mergeVertices = (vertices = []) => {
	if (vertices.length < 2) {
		return;
	}
	vertices.sort((a, b) => a - b);
	// this index will be the one vertex which remains
	const remain = vertices.shift();
	const replace_indices = [];
	vertices.forEach((v) => {
		replace_indices[v] = remain;
	});
	const graph = get(CreasePattern);
	replace(graph, "vertices", replace_indices);
	UpdateFrame({ ...graph });
};
/**
 *
 */
export const mergeSelectedVertices = () =>
	mergeVertices(get(Selection).vertices);
