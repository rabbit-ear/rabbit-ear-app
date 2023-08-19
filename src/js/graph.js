import populate from "rabbit-ear/graph/populate.js";

export const makeEmptyGraph = () => populate({
	vertices_coords: [],
	edges_vertices: [],
	edges_assignment: [],
	edges_foldAngle: [],
	faces_vertices: [],
});

export const getVerticesFromSelection = (graph, selection) => {
	const vertexHash = {};
	selection.edges
		.forEach(e => graph.edges_vertices[e]
			.forEach(v => { vertexHash[v] = true; }));
	selection.faces
		.forEach(e => graph.faces_vertices[e]
			.forEach(v => { vertexHash[v] = true; }));
	return Object.keys(vertexHash).map(n => parseInt(n, 10));
};
