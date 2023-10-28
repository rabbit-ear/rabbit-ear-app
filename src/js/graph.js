import { flattenFrame } from "rabbit-ear/fold/frames.js";
import { assignmentFlatFoldAngle } from "rabbit-ear/fold/spec.js";
import { distance } from "rabbit-ear/math/vector.js";
import planarize from "rabbit-ear/graph/planarize.js";
import populate from "rabbit-ear/graph/populate.js";
/**
 * @description Create an empty FOLD graph.
 */
export const makeEmptyGraph = () => populate({
	vertices_coords: [],
	edges_vertices: [],
	edges_assignment: [],
	edges_foldAngle: [],
	faces_vertices: [],
});
/**
 * @description Given a FOLD graph, a list of edge indices, and
 * an assignment, and an optional fold angle, set the edges to be
 * this assignment, and by default the corresponding fold angle, unless
 * a fold angle is provided, then set the user supplied one.
 */
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
/**
 * @description Given a FOLD graph and a list of edges, toggle
 * the assignment so that all mountains become valleys and valleys
 * become mountains, and their fold angle will update as well.
 */
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
/**
 * @description Given a FOLD graph and a list of edges and a fold
 * angle, set these edge's fold angle to be the value supplied
 * by the user. If the edge is a mountain or a valley, this function
 * will ensure that the proper sign is given to the value, meaning,
 * you can give 180 degrees to all mountain and valley edges, and
 * the mountain ones will automatically be assigned -180.
 */
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
/**
 * @description a FOLD object with frames is arranged such that
 * the top level is frame [0], and frames 1...N-1 are inside of
 * an array under the key "file_frames". This method converts
 * a flat array of frames into a FOLD object with "file_frames".
 */
export const reassembleFramesToFOLD = (frames) => {
	const FOLD = { ...frames[0] };
	const file_frames = frames.slice(1);
	if (file_frames.length) { FOLD.file_frames = file_frames; }
	return FOLD;
};
/**
 * @description Is a FOLD object a crease pattern or a folded form?
 * If folded form, return false, otherwise, even if there is too little
 * information, return true (this is a crease pattern). This is used
 * to know whether or not a graph is "editable" as a crease pattern.
 * So, for example, if the graph is entirely empty, yes, we can begin
 * to edit it like a crease pattern, so the method returns true.
 * @returns {boolean} true if the graph is a crease pattern.
 */
export const graphIsCreasePattern = (graph) => {
	// if graph is empty, it is a crease pattern
	if (!graph) { return true; }
	// if graph has "creasePattern" metadata, it is a crease pattern
	if (graph.frame_classes) {
		if (graph.frame_classes.includes("creasePattern")) { return true; }
		if (graph.frame_classes.includes("foldedForm")) { return false; }
	}
	// if no metadata exists, check the vertices.
	if (!graph.vertices_coords) { return true; }
	// if graph has 3D vertices and if those Z components are outside
	// of the XY plane, it's not a crease pattern. otherwise, yes.
	return graph.vertices_coords
		.filter(coords => coords !== undefined)
		.map(coords => coords[2])
		.filter(n => n !== undefined)
		.filter(n => Math.abs(n) > 1e-2)
		.length === 0;
};

export const shortestEdgeLength = (graph) => {
	if (!graph || !graph.vertices_coords || !graph.edges_vertices) { return 0; }
	const lengths = graph.edges_vertices
		.map(ev => ev.map(v => graph.vertices_coords[v]))
		.map(segment => distance(...segment));
	const minLen = lengths
		.reduce((a, b) => Math.min(a, b), Infinity);
	return minLen === Infinity ? undefined : minLen;
};

// const renderTessellationFrame = (frames, frameNum = 0, repeats = 6) => {
// 	// "ear:tiles": [{
// 	// 	"frame": 0,
// 	// 	"regularBasis_vectors": [
// 	// 		[4, 0],
// 	// 		[0, 4]
// 	// 	],
// 	// 	"regularBasis_origins": [
// 	// 		[0, 0],
// 	// 		[0, 0]
// 	// 	]
// 	// }]
// 	const graph = {};
// 	const tiles = frames[frameNum]["ear:tiles"];

// 	// const basisVectors = 
// 	return frames[frameNum];
// };
