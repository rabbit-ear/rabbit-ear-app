import { get } from "svelte/store";
import {
	CreasePattern,
	IsoUpdateFrame,
} from "../../stores/Model.js";
import { assignmentCanBeFolded } from "rabbit-ear/fold/spec.js";
import {
	setEdgesAssignment,
	toggleEdgesAssignment,
	setEdgesFoldAngle,
} from "../../js/graph.js";

export const toggleAssignment = (edges) => {
	const graph = get(CreasePattern);
	toggleEdgesAssignment(graph, edges);
	IsoUpdateFrame({ ...graph });
};

export const invertAssignments = () => {
	const graph = get(CreasePattern);
	const edges_assignment = graph.edges_assignment || [];
	const edges = (graph.edges_vertices || [])
		.map((_, i) => i)
		.filter(e => assignmentCanBeFolded[graph.edges_assignment[e]])
	toggleEdgesAssignment(graph, edges);
	IsoUpdateFrame({ ...graph });
};

export const setAssignment = (edges, assignment, foldAngle) => {
	const graph = get(CreasePattern);
	setEdgesAssignment(graph, edges, assignment, foldAngle);
	IsoUpdateFrame({ ...graph });
};

export const setFoldAngle = (edges, foldAngle) => {
	const graph = get(CreasePattern);
	setEdgesFoldAngle(graph, edges, foldAngle);
	IsoUpdateFrame({ ...graph });
};
