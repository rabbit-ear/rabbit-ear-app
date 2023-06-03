import { get } from "svelte/store";
import { boundingBox as makeBoundingBox } from "rabbit-ear/math/geometry/polygon.js";
import { writable } from "svelte/store";

const makeEmptyGraph = () => ({
	vertices_coords: [],
	edges_vertices: [],
	edges_assignment: [],
	edges_foldAngle: [],
	faces_vertices: [],
})

// export const graph = writable(makeEmptyGraph());

export const boundingBox = writable({ min: [0, 0], max: [1, 1], span: [1, 1] });

const { subscribe, set, update } = writable(makeEmptyGraph());

export const graph = {
	subscribe,
	set: (g) => {
		// boundingBox.set(makeBoundingBox(get(graph).vertices_coords || []));
		return set(g);
	},
	planarize: () => update(g => ear.graph.planarize(g)),
	reset: () => set(makeEmptyGraph()),
};

export const metadata = writable({
	newestVertex: undefined, // {number} index in vertices_coords.
});

// operations that should modify the graph
// export const planarize = () => {};
// export const addVertex = (point) => {};
// export const addEdgeBetweenVertices = (vertices) => {};

