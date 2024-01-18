import { get } from "svelte/store";
import { writable, derived } from "svelte/store";
import { assignLists } from "../js/arrays.js";
import { IsolatedFrame } from "./Model.js";
import { getInclusiveVertices } from "../js/select.js";

export const emptyComponentObject = () => (
	{ vertices: [], edges: [], faces: [] }
);

/**
 * @value object contains "vertices", "edges", "faces" keys, with
 * array values, where the arrays are either empty, or contain a list
 * of indices that are the selected component indices.
 * for example: { vertices: [], edges: [5, 12, 19, 22, 34], faces: [] }
 */
export const Selection = writable(emptyComponentObject());

Selection.reset = () => Selection.set(emptyComponentObject());

Selection.isEmpty = () => Object.values(get(Selection))
	.map(arr => arr.length === 0)
	.reduce((a, b) => a && b, true);

Selection.addVertices = (verts) => Selection.update(obj => {
	assignLists(obj.vertices, verts);
	return obj;
});

Selection.addEdges = (edges) => Selection.update(obj => {
	assignLists(obj.edges, edges);
	return obj;
});

Selection.addFaces = (faces) => Selection.update(obj => {
	assignLists(obj.faces, faces);
	return obj;
});

Selection.getInclusiveVertices = () => (
	getInclusiveVertices(get(IsolatedFrame), get(Selection))
);
