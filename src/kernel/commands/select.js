import { get } from "svelte/store";
import { subgraph } from "rabbit-ear/graph/subgraph.js";
import normalize from "rabbit-ear/graph/normalize.js";
import { join } from "rabbit-ear/graph/join.js";
import {
	Graph,
	UpdateFrame,
} from "../../stores/Model.js";
import { Selection } from "../../stores/Select.js";
import { Highlight } from "../../stores/Select.js";
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

export const highlight = (components) => {
	if (!components) { return; }
	Highlight.reset();
	if (components.vertices) { Highlight.addEdges(components.vertices); }
	if (components.edges) { Highlight.addEdges(components.edges); }
	if (components.faces) { Highlight.addEdges(components.faces); }
};

export const getSelectedVertices = () => get(Selection).vertices;
export const getSelectedEdges = () => get(Selection).edges;
export const getSelectedFaces = () => get(Selection).faces;

export const selectEdgesWithAssignment = (assignment = "B") => {
	const assign = assignment.toUpperCase();
	Selection.reset();
	Selection.addEdges((get(Graph).edges_assignment || [])
		.map(a => a.toUpperCase())
		.map((a, i) => a === assign ? i : undefined)
		.filter(i => i !== undefined));
};
/**
 *
 */
export const duplicateSelection = () => {
	const selection = get(Selection);
	const graph = get(Graph);
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
	const graph = get(Graph);
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
