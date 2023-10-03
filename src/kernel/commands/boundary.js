import { edgeAssignmentToFoldAngle } from "rabbit-ear/fold/spec.js";
import { planarBoundary } from "rabbit-ear/graph/boundary.js";
import { get } from "svelte/store";
import {
	CreasePattern,
	UpdateFrame,
} from "../../stores/Model.js";

export const rebuildBoundary = () => {
	const graph = get(CreasePattern);
	graph.edges_assignment = (graph.edges_assignment || [])
		.map(a => a === "B" || a === "b" ? "F" : a);
	graph.edges_foldAngle = (graph.edges_foldAngle
		|| graph.edges_assignment.map(a => edgeAssignmentToFoldAngle[a]));
	let edges = [];
	try {
		edges = planarBoundary(graph).edges;
	} catch (error) {
		// silent error
	}
	edges.forEach(e => { graph.edges_assignment[e] = "B"; });
	edges.forEach(e => { graph.edges_foldAngle[e] = 0; });
	UpdateFrame({ ...graph });
};
