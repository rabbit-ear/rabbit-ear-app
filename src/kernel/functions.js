import { get } from "svelte/store";
// import {
// 	axiom1 as fnAxiom1,
// 	axiom2 as fnAxiom2,
// 	axiom3 as fnAxiom3,
// 	axiom4 as fnAxiom4,
// 	axiom5 as fnAxiom5,
// 	axiom6 as fnAxiom6,
// 	axiom7 as fnAxiom7,
// } from "rabbit-ear/axioms/axiomsVecLine.js";
import {
	axiom1 as fnAxiom1,
	axiom2 as fnAxiom2,
	axiom3 as fnAxiom3,
	axiom4 as fnAxiom4,
	axiom5 as fnAxiom5,
	axiom6 as fnAxiom6,
	axiom7 as fnAxiom7,
} from "rabbit-ear/graph/axioms.js";
import removeGeometry from "rabbit-ear/graph/remove.js";
import Planarize from "rabbit-ear/graph/planarize.js";
import AddVertex from "rabbit-ear/graph/add/addVertex.js";
import addNonPlanarEdge from "rabbit-ear/graph/add/addNonPlanarEdge.js";
import splitEdge from "rabbit-ear/graph/splitEdge/index.js";
import populate from "rabbit-ear/graph/populate.js";
import { add2 } from "rabbit-ear/math/algebra/vector.js";
import { pointsToLine } from "rabbit-ear/math/general/convert.js";
import { assignmentFlatFoldAngle } from "rabbit-ear/fold/spec.js";
import { downloadFile } from "../js/file.js";
import { Graph } from "../stores/Graph.js";
import { Selection } from "../stores/Select.js";
import { Rulers, RulerPreviews } from "../stores/Ruler.js";
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
export const clearSelection = () => Selection.reset();
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
	const g = deleteComponentsFromGraph(get(Graph), remove);
	Graph.set({ ...g });
};

export const snapAllVertices = () => {
	const vertices_coords = get(Graph).vertices_coords || [];
	vertices_coords.forEach((coord, i) => coord.forEach((n, j) => {
		vertices_coords[i][j] = Math.round(n);
	}));
	Graph.set({ ...get(Graph), vertices_coords });
};

export const addVertex = (coords) => {
	const g = get(Graph);
	const newestVertex = AddVertex(g, coords);
	Graph.set({ ...g });
	Selection.reset();
	Selection.addVertices([newestVertex]);
	return newestVertex;
};

export const addEdge = (vertexA, vertexB) => {
	const g = get(Graph);
	const newestEdge = addNonPlanarEdge(g, [vertexA, vertexB]);
	Graph.set({ ...g });
	Selection.reset();
	Selection.addEdges([newestEdge]);
	return newestEdge;
};

export const splitEdges = (edges) => {
	const g = get(Graph);
	const result = edges
		.slice()
		.sort((a, b) => b - a)
		.map(edge => splitEdge(g, edge));
	Graph.set({ ...g });
};

export const translateVertices = (vertices, vector) => {
	const vertices_coords = get(Graph).vertices_coords || [];
	vertices.forEach(v => {
		vertices_coords[v] = add2(vertices_coords[v], vector);
	});
	Graph.simpleSet({ ...get(Graph), vertices_coords });
};

export const setEdgesAssignment = (edges, assignment, foldAngle) => {
	const g = get(Graph);
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
	Graph.simpleSet({ ...g });
};

const signedAssignments = { M: -1, m: -1, V: 1, v: 1 };

export const setEdgesFoldAngle = (edges, foldAngle) => {
	const g = get(Graph);
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
	Graph.simpleSet({ ...g });
};

export const planarize = () => Graph.set(populate(Planarize(get(Graph)), true));

export const load = (FOLD) => Graph.set(populate(FOLD));

export const clear = () => Graph.reset();

export const download = (filename) => (
	downloadFile(JSON.stringify(get(Graph)), filename)
);

const doAxiom1 = (a, b) => a !== undefined && b !== undefined
	? fnAxiom1(get(Graph), a, b)
	: [];
const doAxiom2 = (a, b) => a !== undefined && b !== undefined
	? fnAxiom2(get(Graph), a, b)
	: [];
const doAxiom3 = (a, b) => a !== undefined && b !== undefined
	? fnAxiom3(get(Graph), a, b)
	: [];
const doAxiom4 = (a, b) => a !== undefined && b !== undefined
	? fnAxiom4(get(Graph), a, b)
	: [];
const doAxiom5 = (a, b, c) => (
	a !== undefined && b !== undefined && c !== undefined
		? fnAxiom5(get(Graph), a, b, c)
		: []);
const doAxiom6 = (a, b, c, d) => (
	a !== undefined && b !== undefined && c !== undefined && d !== undefined
		? fnAxiom6(get(Graph), a, b, c, d)
		: []);
const doAxiom7 = (a, b, c) => (
	a !== undefined && b !== undefined && c !== undefined
		? fnAxiom7(get(Graph), a, b, c)
		: []);

export const axiom1 = (...args) => Rulers.add(doAxiom1(...args));
export const axiom2 = (...args) => Rulers.add(doAxiom2(...args));
export const axiom3 = (...args) => Rulers.add(doAxiom3(...args));
export const axiom4 = (...args) => Rulers.add(doAxiom4(...args));
export const axiom5 = (...args) => Rulers.add(doAxiom5(...args));
export const axiom6 = (...args) => Rulers.add(doAxiom6(...args));
export const axiom7 = (...args) => Rulers.add(doAxiom7(...args));

export const axiom1Preview = (...args) => RulerPreviews.set(doAxiom1(...args));
export const axiom2Preview = (...args) => RulerPreviews.set(doAxiom2(...args));
export const axiom3Preview = (...args) => RulerPreviews.set(doAxiom3(...args));
export const axiom4Preview = (...args) => RulerPreviews.set(doAxiom4(...args));
export const axiom5Preview = (...args) => RulerPreviews.set(doAxiom5(...args));
export const axiom6Preview = (...args) => RulerPreviews.set(doAxiom6(...args));
export const axiom7Preview = (...args) => RulerPreviews.set(doAxiom7(...args));
