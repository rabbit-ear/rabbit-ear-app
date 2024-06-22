import { get } from "svelte/store";
import { CreasePattern } from "../../stores/ModelCP.js";
import { Selection } from "../../stores/Select.js";
import { Highlight } from "../../stores/UI.js";

/**
 *
 */
export const selectAll = () => {
	const graph = get(CreasePattern);
	if (!graph) {
		return;
	}
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
		case "vertices":
			return Selection.addVertices(components);
		case "edges":
			return Selection.addEdges(components);
		case "faces":
			return Selection.addFaces(components);
	}
};

/**
 *
 */
export const highlight = (components) => {
	if (!components) {
		return;
	}
	Highlight.reset();
	if (components.vertices) {
		Highlight.addEdges(components.vertices);
	}
	if (components.edges) {
		Highlight.addEdges(components.edges);
	}
	if (components.faces) {
		Highlight.addEdges(components.faces);
	}
};

/**
 *
 */
export const selected = () => get(Selection);

/**
 *
 */
export const selectEdgesWithAssignment = (assignment = "B") => {
	const assign = assignment.toUpperCase();
	Selection.reset();
	Selection.addEdges(
		(get(CreasePattern).edges_assignment || [])
			.map((a) => a.toUpperCase())
			.map((a, i) => (a === assign ? i : undefined))
			.filter((i) => i !== undefined),
	);
};
