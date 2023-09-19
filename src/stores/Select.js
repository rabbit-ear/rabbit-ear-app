import { get } from "svelte/store";
import { writable } from "svelte/store";
import {
	invertMap,
	combineIntegerSets,
} from "../js/arrays.js";

export const emptyComponentObject = () => (
	{ vertices: [], edges: [], faces: [] }
);

export const Selection = writable(emptyComponentObject());
Selection.reset = () => Selection.set(emptyComponentObject());
Selection.addVertices = (verts) => Selection.update(obj => {
	obj.vertices = combineIntegerSets(obj.vertices, verts);
	return obj;
});
Selection.addEdges = (verts) => Selection.update(obj => {
	obj.edges = combineIntegerSets(obj.edges, verts);
	return obj;
});
Selection.addFaces = (verts) => Selection.update(obj => {
	obj.faces = combineIntegerSets(obj.faces, verts);
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
	obj.vertices = combineIntegerSets(obj.vertices, verts);
	return obj;
});
Highlight.addEdges = (verts) => Highlight.update(obj => {
	obj.edges = combineIntegerSets(obj.edges, verts);
	return obj;
});
Highlight.addFaces = (verts) => Highlight.update(obj => {
	obj.faces = combineIntegerSets(obj.faces, verts);
	return obj;
});
