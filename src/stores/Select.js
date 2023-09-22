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
// Selection.lookup = () => {
// 	const obj = get(Selection);
// 	return {
// 		vertices: invertMap(obj.vertices),
// 		edges: invertMap(obj.edges),
// 		faces: invertMap(obj.faces),
// 	};
// }

export const Highlight = writable(emptyComponentObject());
Highlight.reset = () => Highlight.set(emptyComponentObject()),
Highlight.addVertices = (verts) => Highlight.update(obj => {
	assignLists(obj.vertices, verts);
	return obj;
});
Highlight.addEdges = (edges) => Highlight.update(obj => {
	assignLists(obj.edges, edges);
	return obj;
});
Highlight.addFaces = (faces) => Highlight.update(obj => {
	assignLists(obj.faces, faces);
	return obj;
});
