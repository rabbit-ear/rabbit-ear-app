import { get } from "svelte/store";
import removeGeometry from "rabbit-ear/graph/remove.js";
import Planarize from "rabbit-ear/graph/planarize.js";
import AddVertex from "rabbit-ear/graph/add/addVertex.js";
import addNonPlanarEdge from "rabbit-ear/graph/add/addNonPlanarEdge.js";
import splitEdge from "rabbit-ear/graph/splitEdge/index.js";
import populate from "rabbit-ear/graph/populate.js";
import { add2 } from "rabbit-ear/math/algebra/vector.js";
import { assignmentFlatFoldAngle } from "rabbit-ear/fold/spec.js";
import { graph } from "../stores/graph.js";
import { selection } from "../stores/select.js";
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
export const clearSelection = () => selection.reset();
/**
 *
 */
export const addToSelection = (component = "vertices", components = []) => {
	switch (component) {
	case "vertices": return selection.addVertices(components);
	case "edges": return selection.addEdges(components);
	case "faces": return selection.addFaces(components);
	}
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
	console.log("DEL", remove);
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

export const addVertex = (coords) => {
	const g = get(graph);
	const newestVertex = AddVertex(g, coords);
	graph.set({ ...g });
	selection.reset();
	selection.addVertices([newestVertex]);
	return newestVertex;
};

export const addEdge = (vertexA, vertexB) => {
	const g = get(graph);
	const newestEdge = addNonPlanarEdge(g, [vertexA, vertexB]);
	graph.set({ ...g });
	selection.reset();
	selection.addEdges([newestEdge]);
	return newestEdge;
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

export const setEdgesAssignment = (edges, assignment, foldAngle) => {
	const g = get(graph);
	// ensure edges_assignment and edges_foldAngle exist
	if (!g.edges_vertices) { return; }
	if (!g.edges_assignment) {
		g.edges_assignment = g.edges_vertices.map(() => "U");
	}
	if (!g.edges_foldAngle) {
		g.edges_foldAngle = g.edges_vertices.map(() => 0);
	}
	// set data
	edges.forEach(e => { g.edges_assignment[e] = assignment; });
	if (foldAngle === undefined) {
		foldAngle = assignmentFlatFoldAngle[assignment] || 0;
	}
	edges.forEach(e => { g.edges_foldAngle[e] = foldAngle; });
	graph.simpleSet({ ...g });
};

const signedAssignments = { M: -1, m: -1, V: 1, v: 1 };

export const setEdgesFoldAngle = (edges, foldAngle) => {
	const g = get(graph);
	// ensure edges_foldAngle exist
	if (!g.edges_vertices) { return; }
	if (!g.edges_foldAngle) {
		g.edges_foldAngle = g.edges_vertices.map(() => 0);
	}
	// if edges_assignment exists, use it to ensure sign is correct
	// (M is - and V is +, anything else don't touch).
	if (g.edges_assignment) {
		edges.forEach(e => {
			// if the assignment is M or V, and
			// the foldAngle sign doesn't match, flip it
			if (g.edges_assignment[e] in signedAssignments
				&& Math.sign(foldAngle) !== signedAssignments[g.edges_assignment[e]]) {
				g.edges_foldAngle[e] = -foldAngle;
			} else {
				g.edges_foldAngle[e] = foldAngle;
			}
		});
	} else {
		edges.forEach(e => { g.edges_foldAngle[e] = foldAngle; });
	}
	graph.simpleSet({ ...g });
};

export const planarize = () => graph.set(populate(Planarize(get(graph)), true));

export const load = (FOLD) => graph.set(populate(FOLD));

export const clear = () => graph.reset();

export const download = (filename) => (
	downloadFile(JSON.stringify(get(graph)), filename)
);
