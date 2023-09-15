import { planarBoundary } from "rabbit-ear/graph/boundary.js";
import { get } from "svelte/store";
import {
	Graph,
	UpdateFrame,
} from "../../stores/Model.js";

export const rebuildBoundary = () => {
	const graph = get(Graph);
	graph.edges_assignment = (graph.edges_assignment || [])
		.map(a => a === "B" || a === "b" ? "F" : a);
	graph.edges_foldAngle = (graph.edges_foldAngle || []);
	const { edges } = planarBoundary(graph);
	edges.forEach(e => { graph.edges_assignment[e] = "B"; });
	edges.forEach(e => { graph.edges_foldAngle[e] = 0; });
	UpdateFrame({ ...graph });
};
