import { get } from "svelte/store";
import { writable } from "svelte/store";
import {
	invertMap,
	mergeArrays,
} from "../js/arrays.js";

export const emptyComponentObject = () => (
	{ vertices: [], edges: [], faces: [] }
);

export const SelectionRect = writable(undefined);

const { subscribe, set, update } = writable(emptyComponentObject());

export const Selection = {
	subscribe,
	set,
	update,
	reset: () => set(emptyComponentObject()),
	addVertices: (verts) => update(obj => {
		obj.vertices = mergeArrays(obj.vertices, verts);
		return obj;
	}),
	addEdges: (verts) => update(obj => {
		obj.edges = mergeArrays(obj.edges, verts);
		return obj;
	}),
	addFaces: (verts) => update(obj => {
		obj.faces = mergeArrays(obj.faces, verts);
		return obj;
	}),
	// lookup: () => {
	// 	const obj = get(Selection);
	// 	return {
	// 		vertices: invertMap(obj.vertices),
	// 		edges: invertMap(obj.edges),
	// 		faces: invertMap(obj.faces),
	// 	};
	// }
};

const {
	subscribe: subscribeHigh,
	set: setHigh,
	update: updateHigh,
} = writable(emptyComponentObject());

export const Highlight = {
	subscribe: subscribeHigh,
	set: setHigh,
	update: updateHigh,
	reset: () => setHigh(emptyComponentObject()),
	addVertices: (verts) => updateHigh(obj => {
		obj.vertices = mergeArrays(obj.vertices, verts);
		return obj;
	}),
	addEdges: (verts) => updateHigh(obj => {
		obj.edges = mergeArrays(obj.edges, verts);
		return obj;
	}),
	addFaces: (verts) => updateHigh(obj => {
		obj.faces = mergeArrays(obj.faces, verts);
		return obj;
	}),
};
