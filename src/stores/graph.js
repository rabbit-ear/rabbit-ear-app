import { writable } from "svelte/store";

const makeEmptyGraph = () => ({
	vertices_coords: [],
	edges_vertices: [],
	edges_assignment: [],
	edges_foldAngle: [],
	faces_vertices: [],
})

export const graph = writable(makeEmptyGraph());
