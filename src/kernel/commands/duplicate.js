import { get } from "svelte/store";
import { subgraph } from "rabbit-ear/graph/subgraph.js";
import normalize from "rabbit-ear/graph/normalize.js";
import { join } from "rabbit-ear/graph/join.js";
import { UpdateFrame } from "../../stores/Model.js";
import { CreasePattern } from "../../stores/ModelCP.js";
import { Selection } from "../../stores/Select.js";
/**
 *
 */
export const duplicateSelection = () => {
	const selection = get(Selection);
	const graph = get(CreasePattern);
	const sub = subgraph(graph, selection);
	const norm = normalize(sub);
	if ((!norm.vertices_coords || !norm.vertices_coords.length)
		&& (!norm.edges_vertices || !norm.edges_vertices.length)
		&& (!norm.faces_vertices || !norm.faces_vertices.length)) {
		return "nothing selected";
	}
	const result = join(graph, norm);
	UpdateFrame({ ...graph });
	const vertices = result.vertices[1];
	const edges = result.edges[1];
	const faces = result.faces[1];
	Selection.addVertices(vertices);
	Selection.addEdges(edges);
	Selection.addFaces(faces);
};
/**
 *
 */
export const duplicateAll = () => {
	const graph = get(CreasePattern);
	const vertices = (graph.vertices_coords || []).map((_, i) => i);
	Selection.addVertices(vertices);
	return duplicateSelection();
};
/**
 *
 */
export const duplicate = () => Selection.isEmpty()
	? duplicateAll()
	: duplicateSelection();
