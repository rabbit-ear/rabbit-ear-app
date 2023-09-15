import { get } from "svelte/store";
import { writable, derived } from "svelte/store";
import { getFileMetadata } from "rabbit-ear/fold/spec.js";
import { getFramesAsFlatArray } from "rabbit-ear/fold/frames.js";
import populate from "rabbit-ear/graph/populate.js";
import { graphToMatrix2 } from "../js/matrix.js";
import {
	makeEmptyGraph,
	renderFrames,
} from "../js/graph.js";
import {
	CameraMatrix,
	ModelMatrix,
	AutoSizeModelMatrix,
} from "./ViewBox.js";
import { FileHistory } from "./History.js";
import { Selection } from "./Select.js";
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
	Selection.reset();
	FrameIndexSet(n);
};
/**
 * @description The currently selected (and currently being edited) frame.
 */
// export const Graph = derived(
// 	[FramesRendered, FrameIndex, AutoSizeModelMatrix],
// 	([$FramesRendered, $FrameIndex, $AutoSizeModelMatrix]) => {
// 		const newGraph = $FramesRendered[$FrameIndex];
// 		if ($AutoSizeModelMatrix) {
// 			ModelMatrix.set(graphToMatrix2(newGraph));
// 		}
// 		return newGraph;
// 	},
// 	makeEmptyGraph(),
// );
export const Graph = derived(
	[FramesRendered, FrameIndex],
	([$FramesRendered, $FrameIndex]) => $FramesRendered[$FrameIndex],
	makeEmptyGraph(),
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
	// ModelMatrix is a derived state. this is basically like
	// calling "ModelMatrix.reset()" to resize it to the new Model.
	const autoSize = get(AutoSizeModelMatrix);
	AutoSizeModelMatrix.set(true);
	// load file
	Selection.reset();
	FileHistory.set([]);
	FrameIndex.set(0);
	File.set(getFileMetadata(FOLD));
	Frames.set(getFramesAsFlatArray(FOLD).map(populate));
	CameraMatrix.reset();
	// end load file. return ModelMatrix setting back to what it was.
	AutoSizeModelMatrix.set(autoSize);
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
