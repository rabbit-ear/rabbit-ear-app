import { get } from "svelte/store";
import { Graph } from "../../stores/Model.js";
import { Selection } from "../../stores/Select.js";
/**
 *
 */
export const selectAll = () => {
	const graph = get(Graph);
	const vertices = (graph.vertices_coords || []).map((_, i) => i);
	const edges = (graph.edges_vertices || []).map((_, i) => i);
	const faces = (graph.faces_vertices || []).map((_, i) => i);
	Selection.addVertices(vertices);
	Selection.addEdges(edges);
	Selection.addFaces(faces);
};
/**
 *
 */
export const deselectAll = () => Selection.reset();
/**
 *
 */
export const addToSelection = (component = "vertices", components = []) => {
	switch (component) {
	case "vertices": return Selection.addVertices(components);
	case "edges": return Selection.addEdges(components);
	case "faces": return Selection.addFaces(components);
	}
};