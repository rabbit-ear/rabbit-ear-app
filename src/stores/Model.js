import { get, writable, derived } from "svelte/store";
import { getFileMetadata } from "rabbit-ear/fold/spec.js";
import { flattenFrame, getFileFramesAsArray } from "rabbit-ear/fold/frames.js";
import { populate } from "rabbit-ear/graph/populate.js";
import { reassembleFramesToFOLD, graphIsCreasePattern } from "../js/graph.js";
import { FileModified } from "./File.js";
import {
	CameraMatrixCP,
	CameraMatrixFolded,
	WebGLViewMatrix,
} from "./ViewBox.js";
import { Selection } from "./Select.js";
import { CommandHistory } from "./History.js";

// most of the data stores in this document are essentially the
// deconstructed constituent parts of the FOLD file.
/**
 *
 */
export const AsyncManager = { recalcModelMatrix: false };
let _recalcModelMatrixTimeout = undefined;
export const RecalculateModelMatrix = () => {
	if (_recalcModelMatrixTimeout) {
		clearTimeout(_recalcModelMatrixTimeout);
	}
	_recalcModelMatrixTimeout = setTimeout(() => {
		AsyncManager.recalcModelMatrix = false;
	}, 100);
	AsyncManager.recalcModelMatrix = true;
};
/**
 * @description an object which contains only FOLD file metadata,
 * any key that starts with "file_", for example "file_title".
 */
export const FileMetadata = writable({});
/**
 * @description Contains an array of graphs, each being one frame
 * in the FOLD file, where the first item is the top level frame.
 */
export const Frames = writable([]);
/**
 * @description Which frame is currently visible in the main viewport?
 */
export const FrameIndex = writable(0);
const FrameIndexSet = FrameIndex.set;
FrameIndex.set = (n) => {
	Selection.reset();
	RecalculateModelMatrix();
	FrameIndexSet(n);
	CameraMatrixCP.reset();
	CameraMatrixFolded.reset();
	WebGLViewMatrix.reset();
};
/**
 * @description Because FOLD frames can have parent-child inheritance,
 * To properly render a FOLD frame requires "flattening" all of the
 * frame's parents (recursively) into one single FOLD object frame.
 * This is a copy of the list of "Frames", but each is fully flattened.
 * @todo This is going to be expensive to run when a single frame is modified,
 * currently this is the safe way, but some kind of caching would be ideal.
 */
export const IsolatedFrames = derived(
	Frames,
	($Frames) => {
		// because of the "flattenFrame" method, we need to
		// reassemble the FOLD object back into its original form.
		try {
			const FOLD = reassembleFramesToFOLD($Frames);
			// run flattenFrame on every frame.
			return $Frames.map((_, i) => flattenFrame(FOLD, i));
		} catch (error) {
			return [];
		}
	},
	[],
);
/**
 *
 */
export const IsolatedFrame = derived(
	[IsolatedFrames, FrameIndex],
	([$IsolatedFrames, $FrameIndex]) => $IsolatedFrames[$FrameIndex] || {},
	{},
);
/**
 * @description For each frame, does the frame inherit from a parent frame?
 */
export const FramesInherit = derived(
	Frames,
	($Frames) => $Frames.map((frame) => frame && frame.frame_inherit === true),
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
export const FramesAreCreasePattern = derived(
	IsolatedFrames,
	($IsolatedFrames) => $IsolatedFrames.map(graphIsCreasePattern),
	[],
);
/**
 *
 */
export const FrameIsCreasePattern = derived(
	[FramesAreCreasePattern, FrameIndex],
	([$FramesAreCreasePattern, $FrameIndex]) =>
		$FramesAreCreasePattern[$FrameIndex],
	true,
);

/**
 * @description When the graph requires an update but the change
 * results in an isomorphic graph as it relates to VEF, so, for example,
 * an edge attribute has been changed like edges_assignment.
 * This still requires a drawing update, but all index pointers, like
 * the indices of selected components don't need to be reset.
 */
export const IsoUpdateFrame = (graph) => {
	FileModified.set(true);
	return Frames.update((frames) => {
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
	RecalculateModelMatrix();
	return IsoUpdateFrame(graph);
};
/**
 * @description If "IsoUpdateFrame" is a small update, "UpdateFrame" is a
 * larger update, "SetFrame" is an even larger update, where the
 * viewport is also reset. This is used when loading a new frame.
 */

// todo: this is not being used anywhere in the app. maybe it can solve
// the issue we are experiencing where the viewport doesn't get resized.
export const SetFrame = (graph) => {
	// ModelMatrixCP.set(graphToMatrix2(graph));
	// CameraMatrixCP.reset();
	CameraMatrixFolded.reset();
	WebGLViewMatrix.reset();
	return UpdateFrame(graph);
};
/**
 * @description Load a new file, replace everything currently open.
 * Instead of calling this, call "LoadFile" from inside the File store.
 * Load file metadata and frames and reset the current frame to frame 0.
 * This should include everything that happens in all the other
 * update/set Frame methods.
 */
export const SetNewModel = (FOLD) => {
	let frames = [];
	try {
		frames = getFileFramesAsArray(FOLD).map((graph) =>
			populate(graph, { faces: true }),
		);
	} catch (error) {
		console.warn("SetNewModel", error);
		return;
	}
	RecalculateModelMatrix();
	Selection.reset();
	FrameIndex.set(0);
	FileMetadata.set(getFileMetadata(FOLD));
	Frames.set(frames);
	CommandHistory.set([]);
	CameraMatrixCP.reset();
	CameraMatrixFolded.reset();
	WebGLViewMatrix.reset();
};
