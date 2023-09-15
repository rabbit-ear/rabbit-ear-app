import { get } from "svelte/store";
import {
	Graph,
	UpdateFrame,
} from "../../stores/Model.js";
import { Selection } from "../../stores/Select.js";
import { findEpsilon } from "../../js/epsilon.js";
import { removeDuplicateVertices } from "rabbit-ear/graph/vertices/duplicate.js";
import { cleanNumber } from "rabbit-ear/general/number.js";
import { nearestTwoVertices } from "../../js/errors.js";

export const mergeNearbyVertices = (epsilonFactor = 1e-4) => {
	const graph = get(Graph);
	const epsilon = findEpsilon(graph, epsilonFactor);
	const result = removeDuplicateVertices(graph, epsilon);
	return result.remove.length
		? `removed ${result.remove.length} vertices: [${result.remove.join(" ")}]`
		: `removed no vertices`;
};

export const cleanVertices = () => {
	const graph = get(Graph);
	const vertices_coords = graph.vertices_coords
		.map(coord => coord.map(n => cleanNumber(n, 12)));
	UpdateFrame({ ...graph, vertices_coords });
	return `cleaned ${vertices_coords.length} vertices`;
};

export const snapAllVertices = () => {
	const vertices_coords = get(Graph).vertices_coords || [];
	vertices_coords.forEach((coord, i) => coord.forEach((n, j) => {
		vertices_coords[i][j] = Math.round(n);
	}));
	UpdateFrame({ ...get(Graph), vertices_coords });
};

export const selectNearestVertices = () => {
	const vertices = nearestTwoVertices(get(Graph));
	if (vertices === undefined) { return; }
	Selection.reset();
	Selection.addVertices(vertices);
};