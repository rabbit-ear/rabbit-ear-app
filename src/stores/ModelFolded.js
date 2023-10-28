import {
	writable,
	derived,
} from "svelte/store";
import {
	linearize2DFaces,
} from "rabbit-ear/graph/orders.js";
import {
	makeVerticesCoordsFolded,
	makeVerticesCoordsFlatFolded,
} from "rabbit-ear/graph/vertices/folded.js";
import {
	makeFacesWinding,
} from "rabbit-ear/graph/faces/winding.js";
import planarize from "rabbit-ear/graph/planarize.js";
import {
	graphToMatrix2,
} from "../js/matrix.js";
import {
	ModelMatrixFolded,
} from "./ViewBox.js";
import {
	VerticalUp,
} from "./App.js";
import {
	IsolatedFrame,
	FrameIsCreasePattern,
} from "./Model.js";
import {
	CreasePattern,
	FoldAnglesAreFlat,
} from "./ModelCP.js";
/**
 *
 */
export const FoldedRootFace = writable(0);
/**
 *
 */
const ComputedFoldedCoords = derived(
	[CreasePattern, FoldAnglesAreFlat, FoldedRootFace],
	([$CreasePattern, $FoldAnglesAreFlat, $FoldedRootFace]) => {
		// if the frame is anything other than a crease pattern, the "CreasePattern"
		// model will be an empty graph, so it won't be doing redundant work.
		try {
			// console.log("Model: ComputedFoldedCoords");
			// if all edges_foldAngle are flat, makeVerticesCoordsFlatFolded instead
			if ($CreasePattern
				&& $CreasePattern.vertices_coords
				&& $CreasePattern.edges_vertices
				&& $CreasePattern.faces_vertices) {
				// console.log("Model: ComputedFoldedCoords");
				return $FoldAnglesAreFlat
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
 * @description The FoldedForm will be one of two things:
 * - the current frame in the FOLD file untouched, if that frame is "foldedForm"
 * - a computed state, if the current frame is "creasePattern", then we
 *   use the folded vertices to assemble a folded representation of the CP.
 */
export const FoldedForm = derived(
	[FrameIsCreasePattern, IsolatedFrame, ComputedFoldedCoords, VerticalUp],
	([$FrameIsCreasePattern, $IsolatedFrame, $ComputedFoldedCoords, $VerticalUp]) => {
		// console.log("Model: FoldedForm");
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
export const FoldedFormPlanar = derived(
	[FoldedForm, FoldAnglesAreFlat],
	([$FoldedForm, $FoldAnglesAreFlat]) => {
		try {
			// console.log("Model: FoldedFormPlanar");
			return $FoldAnglesAreFlat ? planarize($FoldedForm) : {};
		} catch (error) {}
		return {};
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
	[FoldedForm, FoldedRootFace, FoldAnglesAreFlat],
	([$FoldedForm, $FoldedRootFace, $FoldAnglesAreFlat]) => {
		// console.log("Model: Faces2DDrawOrder");
		if ($FoldedForm
			&& $FoldedForm.vertices_coords
			&& $FoldedForm.faces_vertices
			&& $FoldAnglesAreFlat) {
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
