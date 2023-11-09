import { get } from "svelte/store";
import {
	add2,
	scale2,
} from "rabbit-ear/math/vector.js";
import {
	multiplyMatrix2Vector2,
	makeMatrix2Rotate,
} from "rabbit-ear/math/matrix2.js"
import { IsoUpdateFrame } from "../../stores/Model.js";
import { CreasePattern } from "../../stores/ModelCP.js";
import { Selection } from "../../stores/Select.js";
import { getVerticesFromSelection } from "../../js/select.js";

export const translateAll = (vector) => {
	const graph = get(CreasePattern);
	const vertices_coords = graph.vertices_coords || [];
	vertices_coords.forEach((_, v) => {
		vertices_coords[v] = add2(vertices_coords[v], vector);
	});
	IsoUpdateFrame({ ...graph, vertices_coords });
};

export const translateVertices = (vector, vertices) => {
	if (!vertices.length) { return "no vertices selected"; }
	const graph = get(CreasePattern);
	const vertices_coords = graph.vertices_coords || [];
	vertices.forEach(v => {
		vertices_coords[v] = add2(vertices_coords[v], vector);
	});
	IsoUpdateFrame({ ...graph, vertices_coords });
};

export const translate = (vector) => Selection.isEmpty()
	? translateAll(vector)
	: translateVertices(
		vector,
		getVerticesFromSelection(get(CreasePattern), get(Selection)),
	);

export const scaleAll = (factors = [1, 1, 1]) => {
	const graph = get(CreasePattern);
	const vertices_coords = (graph.vertices_coords || [])
		.map(coords => coords.map((n, i) => n * factors[i]));
	IsoUpdateFrame({ ...graph, vertices_coords });
};

export const scaleVertices = (factors = [1, 1, 1], vertices) => {
	if (!vertices.length) { return "no vertices selected"; }
	const graph = get(CreasePattern);
	const vertices_coords = graph.vertices_coords || [];
	vertices.forEach(v => {
		vertices_coords[v] = vertices_coords[v].map((n, i) => n * factors[i]);
	});
	IsoUpdateFrame({ ...graph, vertices_coords });
};

export const scaleUniform = (factor = 1) => Selection.isEmpty()
	? scaleAll([factor, factor, factor])
	: scaleVertices(
		[factor, factor, factor],
		getVerticesFromSelection(get(CreasePattern), get(Selection)),
	);

export const scale = (x = 1, y = 1, z = 1) => Selection.isEmpty()
	? scaleAll([x, y, z])
	: scaleVertices(
		getVerticesFromSelection(get(CreasePattern), get(Selection)),
		[x, y, z],
	);

// export const scaleCenter = (x = 1, y = 1, z = 1) => Selection.isEmpty()
// 	? scaleAll([x, y, z])
// 	: scaleVertices(
// 		getVerticesFromSelection(get(CreasePattern), get(Selection)),
// 		[x, y, z],
// 	);

export const rotateAll = (radians) => {
	const mat = makeMatrix2Rotate(radians);
	const graph = get(CreasePattern);
	const vertices_coords = (graph.vertices_coords || [])
		.map(coords => multiplyMatrix2Vector2(mat, coords));
	IsoUpdateFrame({ ...graph, vertices_coords });
};

export const rotateVertices = (radians, vertices) => {
	if (!vertices.length) { return "no vertices selected"; }
	const mat = makeMatrix2Rotate(radians);
	const graph = get(CreasePattern);
	const vertices_coords = graph.vertices_coords || [];
	vertices.forEach(v => {
		vertices_coords[v] = multiplyMatrix2Vector2(mat, vertices_coords[v]);
	});
	IsoUpdateFrame({ ...graph, vertices_coords });
};

export const rotateZ = (radians) => Selection.isEmpty()
	? rotateAll(radians)
	: rotateVertices(
		radians,
		getVerticesFromSelection(get(CreasePattern), get(Selection)),
	);
