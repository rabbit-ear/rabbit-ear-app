import { get } from "svelte/store";
import removeGeometry from "rabbit-ear/graph/remove.js";
import Planarize from "rabbit-ear/graph/planarize.js";
import populate from "rabbit-ear/graph/populate.js";
import splitEdge from "rabbit-ear/graph/splitEdge/index.js";
import { add2 } from "rabbit-ear/math/algebra/vector.js";
import { graph } from "../stores/graph.js";
import { selected } from "../stores/select.js";
import { downloadFile } from "../js/file.js";
/**
 *
 */
export const test = (...args) => console.log(["test():"]
	.concat(args.map((arg, i) => `${i}:${typeof arg}:${JSON.stringify(arg)}`))
	.map(s => `${s}\n`)
	.join(""));
/**
 *
 */
export const clearSelection = () => selected.reset();
/**
 *
 */
export const addToSelection = (component = "vertices", components = []) => {
	const sel = get(selected);
	switch (component) {
	case "vertices":
		components.forEach(v => { sel.vertices[v] = true; });
		break;
	case "edges":
		components.forEach(e => { sel.edges[e] = true; });
		break;
	case "faces":
		components.forEach(f => { sel.faces[f] = true; });
		break;
	}
	selected.set(sel);
};

const deleteComponentsFromGraph = (graph, remove) => {
	// add each vertex's adjacent edges to the delete list
	if (graph.vertices_edges) {
		remove.vertices
			.flatMap((del, v) => del ? graph.vertices_edges[v] : [])
			.forEach(e => { remove.edges[e] = true; });
	}
	// add each vertex's adjacent faces to the delete list
	if (graph.vertices_faces) {
		remove.vertices
			.flatMap((del, v) => del ? graph.vertices_faces[v] : [])
			.forEach(f => { remove.faces[f] = true; });
	}
	// convert object into array of indices. these will be sorted.
	const truthy = (arr) => arr
		.map((del, i) => del ? i : undefined)
		.filter(i => i !== undefined);
	// remove
	["vertices", "edges", "faces"]
		.forEach(key => removeGeometry(graph, key, truthy(remove[key])));
	return graph;
};
/**
 *
 */
export const deleteComponents = (components) => {
	const remove = { vertices: [], edges: [], faces: [] };
	components.vertices.forEach(v => { remove.vertices[v] = true; });
	components.edges.forEach(v => { remove.edges[v] = true; });
	components.faces.forEach(v => { remove.faces[v] = true; });
	const g = deleteComponentsFromGraph(get(graph), remove);
	graph.set({ ...g });
};

export const snapAllVertices = () => {
	const vertices_coords = get(graph).vertices_coords || [];
	vertices_coords.forEach((coord, i) => coord.forEach((n, j) => {
		vertices_coords[i][j] = Math.round(n);
	}));
	graph.set({ ...get(graph), vertices_coords });
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

export const splitEdges = (edges) => {
	const g = get(graph);
	const result = edges
		.slice()
		.sort((a, b) => b - a)
		.map(edge => splitEdge(g, edge));
	graph.set({ ...g });
};

export const translateVertices = (vertices, vector) => {
	const vertices_coords = get(graph).vertices_coords || [];
	vertices.forEach(v => {
		vertices_coords[v] = add2(vertices_coords[v], vector);
	});
	graph.simpleSet({ ...get(graph), vertices_coords });
};

export const planarize = () => graph.set(populate(Planarize(get(graph)), true));

export const load = (FOLD) => graph.set(populate(FOLD));

export const clear = () => graph.reset();

export const download = (filename) => (
	downloadFile(JSON.stringify(get(graph)), filename)
);
