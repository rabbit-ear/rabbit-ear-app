import { get } from "svelte/store";
import { add2 } from "rabbit-ear/math/algebra/vector.js";
import { graph } from "../stores/graph.js";
import { selected } from "../stores/select.js";

export const addToSelection = (selectionObject) => {

};

export const addVertex = (point) => {
	const vertices_coords = get(graph).vertices_coords || [];
	const newestVertex = vertices_coords.length;
	vertices_coords.push(point);
	graph.set({ ...get(graph), vertices_coords });
	// todo: should this automatically add the new vertex to the selection?
	const vertices = [];
	vertices[newestVertex] = true;
	selected.set({ ...get(selected), vertices });
	return newestVertex;
};

export const addEdge = (vertexA, vertexB) => {
	const edges_vertices = get(graph).edges_vertices || [];
	const newestEdge = edges_vertices.length;
	edges_vertices.push([vertexA, vertexB]);
	// edges_assignment.push("U");
	// edges_foldAngle.push(0);
};

export const translateVertices = (vertices, vector) => {
	const vertices_coords = get(graph).vertices_coords || [];
	// if (vertices.length < 2) {
	// 	vertices.forEach(v => { vertices_coords[v] += vector; });
	// } else {
	// 	console.log("move many", origin, end, vector);
	// 	vertices.forEach(v => { vertices_coords[v] += vector; });
	// }
	vertices.forEach(v => {
		vertices_coords[v] = add2(vertices_coords[v], vector);
	});
	graph.simpleSet({ ...get(graph), ...vertices_coords });
}
