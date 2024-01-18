import { get } from "svelte/store";
import { kawasakiSolutions } from "rabbit-ear/singleVertex/kawasaki.js";
import { CreasePattern } from "../../stores/ModelCP.js";

export const kawasaki = (vertex) => {
	const graph = get(CreasePattern);
	const origin = graph.vertices_coords[vertex];
	return kawasakiSolutions(graph, vertex)
		.filter(a => a !== undefined)
		.map(vector => ({ origin, vector }));
};
