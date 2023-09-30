import { get } from "svelte/store";
import { writable, derived } from "svelte/store";
import {
	getFileMetadata,
	edgesFoldAngleAreAllFlat,
} from "rabbit-ear/fold/spec.js";
import { linearOrderFaces } from "rabbit-ear/graph/orders.js";
import { getFramesAsFlatArray } from "rabbit-ear/fold/frames.js";
import {
	makeVerticesCoordsFolded,
	makeVerticesCoordsFlatFolded,
} from "rabbit-ear/graph/vertices/folded.js";
import { makeFacesWinding } from "rabbit-ear/graph/faces/winding.js";
import populate from "rabbit-ear/graph/populate.js";
import { graphToMatrix2 } from "../js/matrix.js";
import {
	makeEmptyGraph,
	renderFrames,
} from "../js/graph.js";
import {
	CameraMatrix,
	ModelMatrix,
} from "./ViewBox.js";
import { Selection } from "./Select.js";
/**
 *
 */
const ResizeModelMatrix = writable(false);
/**
 *
 */
export const TessellationRepeats = writable(6);
/**
 * @description an object which contains only FOLD file metadata,
 * any key that starts with "file_", for example "file_title".
 */
export const File = writable({});
/**
 * @description Contains an array of graphs, each being one frame
 * in the FOLD file, where the first item is the top level frame.
 */
export const Frames = writable([makeEmptyGraph()]);
// const FramesUpdate = Frames.update;
// const FramesSet = Frames.set;
// Frames.update = (updateMethod) => {
// 	console.log("Frames.update", updateMethod);
// 	// trigger model-matrix to update
// 	ResizeModelMatrix.set(true);
// 	FramesUpdate(updateMethod);
// 	// reset model-matrix to no longer update
// 	ResizeModelMatrix.set(false);
// 	// also reset camera
// 	CameraMatrix.reset();
// };
// Frames.set = (newFrames) => {
// 	console.log("Frames.set", newFrames);
// 	// trigger model-matrix to update
// 	ResizeModelMatrix.set(true);
// 	FramesSet(newFrames);
// 	// reset model-matrix to no longer update
// 	ResizeModelMatrix.set(false);
// 	// also reset camera
// 	CameraMatrix.reset();
// };
/**
 * @description Because FOLD frames can have parent-child inheritance,
 * To properly render a FOLD frame requires "flattening" all of the
 * frame's parents (recursively) into one single FOLD object frame.
 * This is a copy of the list of "Frames", but each is fully flattened.
 * @todo This is going to be expensive to run when a single frame is modified,
 * currently this is the safe way, but some kind of caching would be ideal.
 */
export const FramesRendered = derived(
	[Frames, TessellationRepeats],
	([$Frames, $TessellationRepeats]) => renderFrames($Frames, $TessellationRepeats),
	[makeEmptyGraph()],
);
/**
 * @description Which frame is currently visible in the main viewport?
 */
export const FrameIndex = writable(0);
const FrameIndexSet = FrameIndex.set;
FrameIndex.set = (n) => {
	// trigger model-matrix to update
	ResizeModelMatrix.set(true);
	Selection.reset();
	FrameIndexSet(n);
	// reset model-matrix to no longer update
	ResizeModelMatrix.set(false);
	// also reset camera
	CameraMatrix.reset();
};
/**
 * @description The currently selected (and currently being edited) frame.
 */
export const Graph = derived(
	[FramesRendered, FrameIndex, ResizeModelMatrix],
	([$FramesRendered, $FrameIndex, $ResizeModelMatrix]) => {
		const graph = $FramesRendered[$FrameIndex];
		if ($ResizeModelMatrix) { ModelMatrix.set(graphToMatrix2(graph)); }
		return graph;
	},
	makeEmptyGraph(),
);

// const GraphVertices2D = derived(
// 	Graph,
// 	($Graph) => {
// 		for (let i = 0; i < $Graph.length; i += 1) {
// 			if ($Graph[i].length === 3) { return false; }
// 		}
// 		return true;
// 	},
// 	true,
// );

export const FoldedFormIsFlat = derived(
	Graph,
	// ($Graph) => $Graph ? edgesFoldAngleAreAllFlat($Graph) : true,
	($Graph) => {
		console.log("Model: FoldedFormIsFlat");
		return $Graph ? edgesFoldAngleAreAllFlat($Graph) : true
	},
	true,
);

export const FoldedRootFace = writable(0);

export const GraphVerticesFolded = derived(
	[Graph, FoldedFormIsFlat, FoldedRootFace],
	([$Graph, $FoldedFormIsFlat, $FoldedRootFace]) => {
		try {
			// if all edges_foldAngle are flat, makeVerticesCoordsFlatFolded instead
			if ($Graph
				&& $Graph.vertices_coords
				&& $Graph.edges_vertices
				&& $Graph.faces_vertices) {
				console.log("Model: GraphVerticesFolded");
				return $FoldedFormIsFlat
					? makeVerticesCoordsFlatFolded($Graph, $FoldedRootFace)
					: makeVerticesCoordsFolded($Graph, $FoldedRootFace);
			}
			return [];
		} catch (error) {
			console.warn("makeVerticesCoordsFolded", error)
			return [];
		}
	},
	[],
);

export const GraphFacesWinding = derived(
	[Graph, GraphVerticesFolded],
	([$Graph, $GraphVerticesFolded]) => {
		try {
			console.log("Model: GraphFacesWinding");
			return $Graph && $Graph.faces_vertices && $GraphVerticesFolded.length
				? makeFacesWinding({
					vertices_coords: $GraphVerticesFolded,
					faces_vertices: $Graph.faces_vertices,
				})
				: [];
		} catch (error) {
			console.warn("makeFacesWinding", error)
			return [];
		}
	},
	[],
);

export const GraphFolded = derived(
	[Graph, GraphVerticesFolded],
	([$Graph, $GraphVerticesFolded]) => ({
		...$Graph,
		vertices_coords: $GraphVerticesFolded,
	}),
	({}),
);

export const GraphFaceLinearOrder = derived(
	[GraphFolded, FoldedRootFace],
	([$GraphFolded, $FoldedRootFace]) => {
		try {
			console.log("Model: GraphFaceLinearOrder");
			return linearOrderFaces($GraphFolded, $FoldedRootFace);
		} catch (error) {
			console.warn("linearOrderFaces", error)
			return $GraphFolded && $GraphFolded.faces_vertices
				? $GraphFolded.faces_vertices.map((_, i) => i)
				: [];
		}
	},
	[],
);

/**
 * @description For each frame, does the frame inherit from a parent frame?
 */
export const FramesInherit = derived(
	Frames,
	($Frames) => $Frames
		.map(frame => frame.frame_inherit === true),
	[false],
);
/**
 * @description A frame is locked (unable to edit) if it contains
 * inheritance, or, if it is a child with another frame as its parent.
 */
export const FrameIsLocked = derived(
	[FramesInherit, FrameIndex],
	([$FramesInherit, $FrameIndex]) => $FramesInherit[$FrameIndex],
	false,
);
/**
 *
 */
// export const FramesIsTessellation = derived(
// 	Frames,
// 	($Frames) => $Frames
// 		.map(frame => frame.frame_classes
// 			&& frame.frame_classes.includes("tessellation"))
// 	[false],
// );
/**
 * @description When the graph requires an update but the change
 * results in an isomorphic graph as it relates to VEF, so, for example,
 * an edge attribute has been changed like edges_assignment.
 * This still requires a drawing update, but all index pointers, like
 * the indices of selected components don't need to be reset.
 */
export const IsoUpdateFrame = (graph) => {
	return Frames.update(frames => {
		frames[get(FrameIndex)] = graph;
		return [...frames];
	});
};
/**
 * @description When the graph requires an update and the result
 * is not isomorphic, components will shift around and indices
 * will no longer match, so more things will need to be reset,
 * as opposed to calling "IsoUpdateFrame".
 */
export const UpdateFrame = (graph) => {
	Selection.reset();
	return IsoUpdateFrame(graph);
};
/**
 *
 */
// export const UpdateModelMatrix = () => {
// 	ModelMatrix.set(graphToMatrix2(get(Graph)));
// }
export const UpdateAndResizeFrame = (graph) => {
	// trigger model-matrix to update
	ResizeModelMatrix.set(true);
	UpdateFrame(graph);
	// reset model-matrix to no longer update
	ResizeModelMatrix.set(false);
};
/**
 * @description If "IsoUpdateFrame" is a small update, "UpdateFrame" is a
 * larger update, "SetFrame" is an even larger update, where the
 * viewport is also reset. This is used when loading a new frame.
 */
export const SetFrame = (graph) => {
	// ModelMatrix.set(graphToMatrix2(graph));
	CameraMatrix.reset();
	return UpdateFrame(graph);
};
/**
 * @description Load a FOLD file and fill all relevant data models,
 * including the file metadata and frames, and reset the current frame
 * to frame 0.
 * This should include everything that happens in all the other
 * update/set Frame methods.
 */
export const LoadFile = (FOLD) => {
	// trigger model-matrix to update
	ResizeModelMatrix.set(true);
	// load file
	Selection.reset();
	FrameIndex.set(0);
	File.set(getFileMetadata(FOLD));
	Frames.set(getFramesAsFlatArray(FOLD).map(populate));
	CameraMatrix.reset();
	// reset model-matrix to no longer update
	ResizeModelMatrix.set(false);
};
/**
 *
 */
export const SaveFile = () => {
	const frames = get(Frames);
	const FOLD = { ...get(File), ...frames[0] };
	if (frames.length > 1) {
		FOLD.file_frames = frames.slice(1);
	}
	return FOLD;
};
