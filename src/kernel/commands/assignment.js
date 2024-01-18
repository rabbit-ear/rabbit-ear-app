import { get } from "svelte/store";
import { IsoUpdateFrame } from "../../stores/Model.js";
import { CreasePattern } from "../../stores/ModelCP.js";
import { assignmentCanBeFolded } from "rabbit-ear/fold/spec.js";
import {
	setEdgesAssignment,
	toggleEdgesAssignment,
	setEdgesFoldAngle,
} from "../../js/graph.js";

/**
 *
 */
export const toggleAssignments = (edges) => {
	const graph = get(CreasePattern);
	toggleEdgesAssignment(graph, edges);
	IsoUpdateFrame({ ...graph });
};

/**
 *
 */
export const invertAssignments = () => {
	const graph = get(CreasePattern);
	const edges_assignment = graph.edges_assignment || [];
	const edges = (graph.edges_vertices || [])
		.map((_, i) => i)
		.filter(e => assignmentCanBeFolded[graph.edges_assignment[e]])
	toggleEdgesAssignment(graph, edges);
	IsoUpdateFrame({ ...graph });
};

/**
 *
 */
export const assignment = (edges, assign, angle) => {
	const graph = get(CreasePattern);
	setEdgesAssignment(graph, edges, assign, angle);
	IsoUpdateFrame({ ...graph });
};

/**
 *
 */
export const foldAngle = (edges, angle) => {
	const graph = get(CreasePattern);
	setEdgesFoldAngle(graph, edges, angle);
	IsoUpdateFrame({ ...graph });
};
