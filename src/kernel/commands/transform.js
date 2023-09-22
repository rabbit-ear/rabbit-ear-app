import { get } from "svelte/store";
import {
	add2,
	scale2,
} from "rabbit-ear/math/vector.js";
import {
	Graph,
	IsoUpdateFrame,
} from "../../stores/Model.js";
import { Selection } from "../../stores/Select.js";
import { getVerticesFromSelection } from "../../js/select.js";

export const translateAll = (vector) => {
	const graph = get(Graph);
	const vertices_coords = graph.vertices_coords || [];
	vertices_coords.forEach((_, v) => {
		vertices_coords[v] = add2(vertices_coords[v], vector);
	});
	IsoUpdateFrame({ ...graph, vertices_coords });
};

export const translateVertices = (vertices, vector) => {
	if (!vertices.length) { return "no vertices selected"; }
	const graph = get(Graph);
	const vertices_coords = graph.vertices_coords || [];
	vertices.forEach(v => {
		vertices_coords[v] = add2(vertices_coords[v], vector);
	});
	IsoUpdateFrame({ ...graph, vertices_coords });
};

export const translate = (vector) => Selection.isEmpty()
	? translateAll(vector)
	: translateVertices(
		getVerticesFromSelection(get(Graph), get(Selection)),
		vector,
	);

export const scale = (scaleFactor = 1) => {
	const graph = get(Graph);
	const vertices_coords = (graph.vertices_coords || [])
		.map(coords => scale2(coords, scaleFactor));
	IsoUpdateFrame({ ...graph, vertices_coords });
};
