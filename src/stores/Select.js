import { get } from "svelte/store";
import { writable } from "svelte/store";
import { assignLists } from "../js/arrays.js";

export const emptyComponentObject = () => (
	{ vertices: [], edges: [], faces: [] }
);

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
