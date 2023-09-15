import { get } from "svelte/store";
import { Graph } from "../../stores/Model.js";
import { kawasakiSolutions } from "rabbit-ear/singleVertex/kawasaki.js";
import { RulerRays } from "../../stores/Ruler.js";

export const kawasakiRulers = (vertex) => {
	const graph = get(Graph);
	const origin = graph.vertices_coords[vertex];
	const rays = kawasakiSolutions(graph, vertex)
		.filter(a => a !== undefined)
		.map(vector => ({ origin, vector }));
	RulerRays.set(rays);
};