import { get } from "svelte/store";
import {
	Graph,
	IsoUpdateFrame,
} from "../../stores/Model.js";
import { assignmentCanBeFolded } from "rabbit-ear/fold/spec.js";
import {
	setEdgesAssignment,
	toggleEdgesAssignment,
	setEdgesFoldAngle,
} from "../../js/graph.js";

export const toggleAssignment = (edges) => {
	const graph = get(Graph);
	toggleEdgesAssignment(graph, edges);
	IsoUpdateFrame({ ...graph });
};

export const invertAssignments = () => {
	const graph = get(Graph);
	const edges_assignment = graph.edges_assignment || [];
	const edges = (graph.edges_vertices || [])
		.map((_, i) => i)
		.filter(e => assignmentCanBeFolded[graph.edges_assignment[e]])
	toggleEdgesAssignment(graph, edges);
	IsoUpdateFrame({ ...graph });
};

export const setAssignment = (edges, assignment, foldAngle) => {
	const graph = get(Graph);
	setEdgesAssignment(graph, edges, assignment, foldAngle);
	IsoUpdateFrame({ ...graph });
};

export const setFoldAngle = (edges, foldAngle) => {
	const graph = get(Graph);
	setEdgesFoldAngle(graph, edges, foldAngle);
	IsoUpdateFrame({ ...graph });
};
