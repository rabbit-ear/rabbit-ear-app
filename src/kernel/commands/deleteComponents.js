import { get } from "svelte/store";
import {
	CreasePattern,
	UpdateFrame,
} from "../../stores/Model.js";
import removeGeometry from "rabbit-ear/graph/remove.js";

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
	if (components.vertices) {
		components.vertices.forEach(v => { remove.vertices[v] = true; });
	}
	if (components.edges) {
		components.edges.forEach(v => { remove.edges[v] = true; });
	}
	if (components.faces) {
		components.faces.forEach(v => { remove.faces[v] = true; });
	}
	const g = deleteComponentsFromGraph(get(CreasePattern), remove);
	UpdateFrame({ ...g });
};
