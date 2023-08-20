import planarize from "rabbit-ear/graph/planarize.js";
import populate from "rabbit-ear/graph/populate.js";
import { flattenFrame } from "rabbit-ear/fold/frames.js";

export const makeEmptyGraph = () => populate({
	vertices_coords: [],
	edges_vertices: [],
	edges_assignment: [],
	edges_foldAngle: [],
	faces_vertices: [],
});

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
