import { get } from "svelte/store";
import { writable } from "svelte/store";

export const emptySelectObject = () => (
	{ vertices: [], edges: [], faces: [] }
);

export const selectionRect = writable(undefined);

const { subscribe, set, update } = writable(emptySelectObject());

/**
 * @description merge two arrays of integers,
 * maintaining their uniqueness.
 */
const mergeArrays = (a, b) => {
	const inverted = [];
	a.forEach(i => { inverted[i] = true; });
	b.forEach(i => { inverted[i] = true; });
	return inverted.map((_, i) => i).filter(() => true);
};

const invertMap = (a) => {
	const inverted = [];
	a.forEach(i => { inverted[i] = true; });
	return inverted;
};

export const selection = {
	subscribe,
	set,
	update,
	reset: () => set(emptySelectObject()),
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
	lookup: () => {
		const obj = get(selection);
		return {
			vertices: invertMap(obj.vertices),
			edges: invertMap(obj.edges),
			faces: invertMap(obj.faces),
		};
	}
}

// const {
// 	subscribe: subscribeSelected,
// 	set: setSelected,
// } = writable(emptySelectObject());

// export const selected = {
// 	subscribe: subscribeSelected,
// 	set: (g) => setSelected(g),
// 	add: (obj) => {
// 		const result = { vertices: [], edges: [], faces: [] };
// 		const near = nearest(graph, point);
// 		result.vertices[near.vertex] = true;
// 		result.edges[near.edge] = true;
// 		result.faces[near.face] = true;
// 		return result;
// 	},
// 	vertices: () => {
// 		const value = get(selected).vertices || [];
// 		return Object.keys(value)
// 			.map(key => value[key] ? key : undefined)
// 			.filter(a => a !== undefined)
// 			.map(n => parseInt(n, 10));
// 	},
// 	edges: () => {
// 		const value = get(selected).edges || [];
// 		return Object.keys(value)
// 			.map(key => value[key] ? key : undefined)
// 			.filter(a => a !== undefined)
// 			.map(n => parseInt(n, 10));
// 	},
// 	faces: () => {
// 		const value = get(selected).faces || [];
// 		return Object.keys(value)
// 			.map(key => value[key] ? key : undefined)
// 			.filter(a => a !== undefined)
// 			.map(n => parseInt(n, 10));
// 	},
// 	reset: () => setSelected(emptySelectObject()),
// };
