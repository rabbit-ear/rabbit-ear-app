import { get } from "svelte/store";
import { writable, derived } from "svelte/store";
import {
	getFileMetadata,
	edgesFoldAngleAreAllFlat,
} from "rabbit-ear/fold/spec.js";
import { linearize2DFaces } from "rabbit-ear/graph/orders.js";
import { getFramesAsFlatArray } from "rabbit-ear/fold/frames.js";
import {
	makeVerticesCoordsFolded,
	makeVerticesCoordsFlatFolded,
} from "rabbit-ear/graph/vertices/folded.js";
import { makeFacesWinding } from "rabbit-ear/graph/faces/winding.js";
import {
	validateKawasaki,
	validateMaekawa,
} from "rabbit-ear/singleVertex/validate.js";
import {
	verticesFoldable,
} from "rabbit-ear/singleVertex/foldable.js";
import populate from "rabbit-ear/graph/populate.js";
import { graphToMatrix2 } from "../js/matrix.js";
import {
	makeEmptyGraph,
	renderFrames,
	graphIsCreasePattern,
} from "../js/graph.js";
import {
	CameraMatrixCP,
	CameraMatrixFolded,
	ModelMatrixCP,
	ModelMatrixFolded,
} from "./ViewBox.js";
import { VerticalUp } from "./App.js";
import { Selection } from "./Select.js";

// most of the data stores in this document are essentially the
// deconstructed constituent parts of the FOLD file.
/**
 *
 */
let _recalcModelMatrix = false;
let _recalcModelMatrixTimeout = undefined;
export const RecalculateModelMatrix = () => {
	if (_recalcModelMatrixTimeout) { clearTimeout(_recalcModelMatrixTimeout); }
	_recalcModelMatrixTimeout = setTimeout(() => { _recalcModelMatrix = false; }, 100);
	_recalcModelMatrix = true;
};
/**
 *
 */
export const TessellationRepeats = writable(6);
/**
 * @description an object which contains only FOLD file metadata,
 * any key that starts with "file_", for example "file_title".
 */
export const FileMetadata = writable({});
/**
 * @description Contains an array of graphs, each being one frame
 * in the FOLD file, where the first item is the top level frame.
 */
// export const Frames = writable([makeEmptyGraph()]);
export const Frames = writable([]);
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
// 	CameraMatrixCP.reset();
// };
// Frames.set = (newFrames) => {
// 	console.log("Frames.set", newFrames);
// 	// trigger model-matrix to update
// 	ResizeModelMatrix.set(true);
// 	FramesSet(newFrames);
// 	// reset model-matrix to no longer update
// 	ResizeModelMatrix.set(false);
// 	// also reset camera
// 	CameraMatrixCP.reset();
// };
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
	[Frames, TessellationRepeats],
	([$Frames, $TessellationRepeats]) => renderFrames($Frames, $TessellationRepeats),
	[],
);
/**
 *
 */
export const IsolatedFrame = derived(
	[IsolatedFrames, FrameIndex],
	([$IsolatedFrames, $FrameIndex]) => $IsolatedFrames[$FrameIndex],
	{},
);
/**
 * @description For each frame, does the frame inherit from a parent frame?
 */
export const FramesInherit = derived(
	Frames,
	($Frames) => $Frames.map(frame => frame && frame.frame_inherit === true),
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
	([$FramesAreCreasePattern, $FrameIndex]) => $FramesAreCreasePattern[$FrameIndex],
	true,
);
/**
 * @description The currently selected (and currently being edited) frame.
 */
export const CreasePattern = derived(
	[IsolatedFrame, FrameIsCreasePattern, VerticalUp],
	([$IsolatedFrame, $FrameIsCreasePattern, $VerticalUp]) => {
		if (!$FrameIsCreasePattern) { return {}; }
		if (_recalcModelMatrix) {
			ModelMatrixCP.set(graphToMatrix2($IsolatedFrame, $VerticalUp));
		}
		return $IsolatedFrame;
	},
	{},
);

// here. if VerticalUp ever changes, call this to update the matrix
// ModelMatrixCP.set(graphToMatrix2($IsolatedFrame, $VerticalUp));
VerticalUp.subscribe(($VerticalUp) => {
	ModelMatrixCP.set(graphToMatrix2(get(IsolatedFrame), $VerticalUp))
});
/**
 *
 */
export const FrameEdgesAreFlat = derived(
	IsolatedFrame,
	// ($IsolatedFrame) => $IsolatedFrame ? edgesFoldAngleAreAllFlat($IsolatedFrame) : true,
	($IsolatedFrame) => {
		// console.log("Model: FrameEdgesAreFlat");
		return $IsolatedFrame ? edgesFoldAngleAreAllFlat($IsolatedFrame) : true;
	},
	true,
);
/**
 *
 */
const VerticesFoldable = derived(
	[FrameEdgesAreFlat, CreasePattern],
	([$FrameEdgesAreFlat, $CreasePattern]) => {
		if ($FrameEdgesAreFlat) { return []; }
		try {
			return verticesFoldable($CreasePattern);
		} catch (error) { console.warn("VerticesFoldable", error); }
		return [];
	},
	[],
);
/**
 *
 */
export const InvalidKawasaki = derived(
	CreasePattern,
	($CreasePattern) => {
		if (!$CreasePattern || !$CreasePattern.edges_vertices) { return []; }
		try {
			return validateKawasaki($CreasePattern, 1e-3);
		} catch (error) {
			console.warn("InvalidKawasaki", error);
		}
		return [];
	},
	[],
);
/**
 *
 */
export const InvalidMaekawa = derived(
	CreasePattern,
	($CreasePattern) => {
		if (!$CreasePattern || !$CreasePattern.edges_vertices) { return []; }
		try {
			return validateMaekawa($CreasePattern);
		} catch (error) {
			console.warn("InvalidMaekawa", error);
		}
		return [];
	},
	[],
);
/**
 *
 */
export const InvalidVertices = derived(
	VerticesFoldable,
	($VerticesFoldable) => $VerticesFoldable
		.map((valid, v) => !valid ? v : undefined)
		.filter(a => a !== undefined),
	[],
)
/**
 *
 */
export const IsFlatFoldable = derived(
	[FrameEdgesAreFlat, InvalidKawasaki, InvalidMaekawa],
	([$FrameEdgesAreFlat, $InvalidKawasaki, $InvalidMaekawa]) => (
		$FrameEdgesAreFlat && !$InvalidKawasaki.length && !$InvalidMaekawa.length
	),
	true,
);
/**
 *
 */
export const Is3DFoldable = derived(
	InvalidVertices,
	($InvalidVertices) => !$InvalidVertices.length,
	true,
);
/**
 *
 */
export const IsFoldable = derived(
	[FrameEdgesAreFlat, IsFlatFoldable, Is3DFoldable],
	([$FrameEdgesAreFlat, $IsFlatFoldable, $Is3DFoldable]) => (
		$FrameEdgesAreFlat ? $IsFlatFoldable : $Is3DFoldable
	),
	true,
);
/**
 *
 */
export const FoldedRootFace = writable(0);
/**
 *
 */
export const ComputedFoldedCoords = derived(
	[CreasePattern, FrameEdgesAreFlat, FoldedRootFace],
	([$CreasePattern, $FrameEdgesAreFlat, $FoldedRootFace]) => {
		// if source frame is not a crease pattern, we can't fold its vertices.
		try {
			// if all edges_foldAngle are flat, makeVerticesCoordsFlatFolded instead
			if ($CreasePattern
				&& $CreasePattern.vertices_coords
				&& $CreasePattern.edges_vertices
				&& $CreasePattern.faces_vertices) {
				// console.log("Model: ComputedFoldedCoords");
				return $FrameEdgesAreFlat
					? makeVerticesCoordsFlatFolded($CreasePattern, $FoldedRootFace)
					: makeVerticesCoordsFolded($CreasePattern, $FoldedRootFace);
			}
			return [];
		} catch (error) {
			console.warn("ComputedFoldedCoords", error)
			return [];
		}
	},
	[],
);
/**
 *
 */
export const FoldedForm = derived(
	[FrameIsCreasePattern, IsolatedFrame, ComputedFoldedCoords, VerticalUp],
	([$FrameIsCreasePattern, $IsolatedFrame, $ComputedFoldedCoords, $VerticalUp]) => {
		// if the frame is a folded form, return the frame itself.
		// otherwise, compute the folded form from the crease pattern.
		const foldedForm = !$FrameIsCreasePattern
			? $IsolatedFrame
			: {
				...$IsolatedFrame,
				// ...structuredClone($IsolatedFrame),
				vertices_coords: $ComputedFoldedCoords,
				frame_classes: ["foldedForm"],
			}
		ModelMatrixFolded.set(graphToMatrix2(foldedForm, $VerticalUp));
		return foldedForm;
	},
	({}),
);
/**
 *
 */
export const LayerOrderKnown = derived(
	FoldedForm,
	($FoldedForm) => $FoldedForm
		&& $FoldedForm.faceOrders
		&& $FoldedForm.faceOrders.length,
	true,
);
/**
 *
 */
export const Faces2DDrawOrder = derived(
	[FoldedForm, FoldedRootFace, FrameEdgesAreFlat],
	([$FoldedForm, $FoldedRootFace, $FrameEdgesAreFlat]) => {
		if ($FoldedForm
			&& $FoldedForm.vertices_coords
			&& $FoldedForm.faces_vertices
			&& $FrameEdgesAreFlat) {
			try {
				return linearize2DFaces($FoldedForm, $FoldedRootFace);
			} catch (error) {
				console.warn("Faces2DDrawOrder", error);
			}
		}
		return $FoldedForm && $FoldedForm.faces_vertices
			? $FoldedForm.faces_vertices.map((_, i) => i)
			: []
	},
	[],
);
/**
 *
 */
export const CPFacesWinding = derived(
	CreasePattern,
	($CreasePattern) => {
		try {
			// console.log("Model: CPFacesWinding");
			return $CreasePattern
				&& $CreasePattern.faces_vertices && $CreasePattern.faces_vertices.length
				&& $CreasePattern.vertices_coords && $CreasePattern.vertices_coords.length
				? makeFacesWinding($CreasePattern)
				: [];
		} catch (error) {
			console.warn("CPFacesWinding", error)
			return [];
		}
	},
	[],
);
/**
 *
 */
export const FoldedFacesWinding = derived(
	FoldedForm,
	($FoldedForm) => {
		try {
			// console.log("Model: FoldedFacesWinding");
			return $FoldedForm
				&& $FoldedForm.faces_vertices && $FoldedForm.faces_vertices.length
				&& $FoldedForm.vertices_coords && $FoldedForm.vertices_coords.length
				? makeFacesWinding($FoldedForm)
				: [];
		} catch (error) {
			console.warn("FoldedFacesWinding", error)
			return [];
		}
	},
	[],
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
// 	ModelMatrixCP.set(graphToMatrix2(get(CreasePattern)));
// }
export const UpdateAndResizeFrame = (graph) => {
	// trigger model-matrix to update
	RecalculateModelMatrix();

	UpdateFrame(graph);
};
/**
 * @description If "IsoUpdateFrame" is a small update, "UpdateFrame" is a
 * larger update, "SetFrame" is an even larger update, where the
 * viewport is also reset. This is used when loading a new frame.
 */
export const SetFrame = (graph) => {
	// ModelMatrixCP.set(graphToMatrix2(graph));
	CameraMatrixCP.reset();
	CameraMatrixFolded.reset();
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
		frames = getFramesAsFlatArray(FOLD).map(populate);
	} catch (error) {
		console.warn("SetNewModel", error);
		return;
	}
	RecalculateModelMatrix();
	Selection.reset();
	FrameIndex.set(0);
	FileMetadata.set(getFileMetadata(FOLD));
	Frames.set(frames);
	CameraMatrixCP.reset();
	CameraMatrixFolded.reset();
};
