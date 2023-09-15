import planarize from "rabbit-ear/graph/planarize.js";
import populate from "rabbit-ear/graph/populate.js";
import { flattenFrame } from "rabbit-ear/fold/frames.js";
import { assignmentFlatFoldAngle } from "rabbit-ear/fold/spec.js";

export const makeEmptyGraph = () => populate({
	vertices_coords: [],
	edges_vertices: [],
	edges_assignment: [],
	edges_foldAngle: [],
	faces_vertices: [],
});

export const setEdgesAssignment = (graph, edges, assignment, foldAngle) => {
	// ensure edges_assignment and edges_foldAngle exist
	if (!graph.edges_vertices) { return; }
	if (!graph.edges_assignment) {
		graph.edges_assignment = graph.edges_vertices.map(() => "U");
	}
	if (!graph.edges_foldAngle) {
		graph.edges_foldAngle = graph.edges_vertices.map(() => 0);
	}
	// set data
	edges.forEach(e => { graph.edges_assignment[e] = assignment; });
	if (foldAngle === undefined) {
		foldAngle = assignmentFlatFoldAngle[assignment] || 0;
	}
	edges.forEach(e => { graph.edges_foldAngle[e] = foldAngle; });
};

const swap = { M: "V", m: "V", V: "M", v: "M" };

export const toggleEdgesAssignment = (graph, edges) => {
	edges.forEach(edge => {
		// if (g.edges_assignment[edge] === "B"
		// 	|| g.edges_assignment[edge] === "b") {
		// 	return;
		// }
		graph.edges_assignment[edge] = swap[graph.edges_assignment[edge]] || "V";
		if (graph.edges_foldAngle[edge] == null
			|| graph.edges_foldAngle[edge] === 0) {
			graph.edges_foldAngle[edge] = graph.edges_assignment[edge] === "M"
				? -180
				: 180;
		} else {
			graph.edges_foldAngle[edge] = graph.edges_assignment[edge] === "M"
				? -Math.abs(graph.edges_foldAngle[edge])
				: Math.abs(graph.edges_foldAngle[edge]);
		}
	});
}

const signedAssignments = { M: -1, m: -1, V: 1, v: 1 };

export const setEdgesFoldAngle = (g, edges, foldAngle) => {
	// ensure edges_foldAngle exist
	if (!g.edges_vertices) { return; }
	if (!g.edges_foldAngle) {
		g.edges_foldAngle = g.edges_vertices.map(() => 0);
	}
	// if edges_assignment exists, use it to ensure sign is correct
	// (M is - and V is +, anything else don't touch).
	if (g.edges_assignment) {
		edges.forEach(e => {
			// if the assignment is M or V, and
			// the foldAngle sign doesn't match, flip it
			if (g.edges_assignment[e] in signedAssignments
				&& Math.sign(foldAngle) !== signedAssignments[g.edges_assignment[e]]) {
				g.edges_foldAngle[e] = -foldAngle;
			} else {
				g.edges_foldAngle[e] = foldAngle;
			}
		});
	} else {
		edges.forEach(e => { g.edges_foldAngle[e] = foldAngle; });
	}
	return g;
};

export const getVerticesFromSelection = (graph, selection) => {
	const vertexHash = {};
	selection.edges
		.forEach(e => graph.edges_vertices[e]
			.forEach(v => { vertexHash[v] = true; }));
	selection.faces
		.forEach(e => graph.faces_vertices[e]
			.forEach(v => { vertexHash[v] = true; }));
	return Object.keys(vertexHash).map(n => parseInt(n, 10));
};
/**
 *
 */
const reassembleFOLD = (frames) => {
	const FOLD = { ...frames[0] };
	const file_frames = frames.slice(1);
	if (file_frames.length) { FOLD.file_frames = file_frames; }
	return FOLD;
};

const renderTessellationFrame = (frames, frameNum = 0, repeats = 6) => {
	// "ear:tiles": [{
	// 	"frame": 0,
	// 	"regularBasis_vectors": [
	// 		[4, 0],
	// 		[0, 4]
	// 	],
	// 	"regularBasis_origins": [
	// 		[0, 0],
	// 		[0, 0]
	// 	]
	// }]
	const graph = {};
	const tiles = frames[frameNum]["ear:tiles"];

	// const basisVectors = 
	return frames[frameNum];
};

const isTessellationFrame = (frame) => frame.frame_classes
	&& frame.frame_classes.length
	&& frame.frame_classes.includes("ear:tessellation");

export const renderFrames = (frames, tessellationRepeats) => {
	// because of the "flattenFrame" method, we need to reassemble the
	// FOLD object back into its original form.
	const FOLD = reassembleFOLD(frames);
	// run flattenFrame on every frame.
	return Array
		.from(Array(frames.length))
		.map((_, i) => isTessellationFrame(frames[i])
			? renderTessellationFrame(frames, i, tessellationRepeats)
			: flattenFrame(FOLD, i));
};
