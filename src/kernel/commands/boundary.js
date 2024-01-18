import { edgeAssignmentToFoldAngle } from "rabbit-ear/fold/spec.js";
import { planarBoundaries } from "rabbit-ear/graph/boundary.js";
import { get } from "svelte/store";
import { UpdateFrame } from "../../stores/Model.js";
import { CreasePattern } from "../../stores/ModelCP.js";

export const rebuildBoundary = () => {
	const graph = get(CreasePattern);
	graph.edges_assignment = (graph.edges_assignment || [])
		.map(a => (a === "B" || a === "b") ? "F" : a);
	graph.edges_foldAngle = (graph.edges_foldAngle
		|| graph.edges_assignment.map(a => edgeAssignmentToFoldAngle[a]));
	try {
		planarBoundaries(graph).forEach(({ edges }) => {
			edges.forEach(e => { graph.edges_assignment[e] = "B"; });
			edges.forEach(e => { graph.edges_foldAngle[e] = 0; });
		});
		UpdateFrame({ ...graph });
	} catch (error) { console.warn("rebuildBoundary", error); }
};
