import { writable } from "svelte/store";

const makeEmptyGraph = () => ({
	vertices_coords: [],
	edges_vertices: [],
	edges_assignment: [],
	edges_foldAngle: [],
	faces_vertices: [],
})

export const graph = writable(makeEmptyGraph());

export const metadata = writable({
	newestVertex: undefined, // {number} index in vertices_coords.
});

// operations that should modify the graph
// export const planarize = () => {};
// export const addVertex = (point) => {};
// export const addEdgeBetweenVertices = (vertices) => {};

