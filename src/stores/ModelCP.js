import { get, derived } from "svelte/store";
import { makeFacesWinding } from "rabbit-ear/graph/faces/winding.js";
import { edgesFoldAngleAreAllFlat } from "rabbit-ear/fold/spec.js";
import { verticesFoldable } from "rabbit-ear/singleVertex/foldable.js";
import {
	verticesFlatFoldableKawasaki,
	verticesFlatFoldableMaekawa,
} from "rabbit-ear/singleVertex/flatFoldable.js";
import { graphToMatrix2 } from "../js/matrix.js";
import { ModelMatrixCP } from "./ViewBox.js";
import { VerticalUp } from "./App.js";
import { IsolatedFrame, FrameIsCreasePattern, AsyncManager } from "./Model.js";
/**
 * @description The currently selected (and currently being edited) frame.
 */
export const CreasePattern = derived(
	[IsolatedFrame, FrameIsCreasePattern, VerticalUp],
	([$IsolatedFrame, $FrameIsCreasePattern, $VerticalUp]) => {
		if (!$FrameIsCreasePattern) {
			return {};
		}
		if (AsyncManager.recalcModelMatrix) {
			ModelMatrixCP.set(graphToMatrix2($IsolatedFrame, $VerticalUp));
		}
		return $IsolatedFrame;
	},
	{},
);
// here. if VerticalUp ever changes, call this to update the matrix
// ModelMatrixCP.set(graphToMatrix2($IsolatedFrame, $VerticalUp));
VerticalUp.subscribe(($VerticalUp) => {
	ModelMatrixCP.set(graphToMatrix2(get(IsolatedFrame), $VerticalUp));
});
/**
 *
 */
export const InvalidKawasaki = derived(
	CreasePattern,
	($CreasePattern) => {
		if (!$CreasePattern || !$CreasePattern.edges_vertices) {
			return [];
		}
		try {
			return verticesFlatFoldableKawasaki($CreasePattern, 1e-3)
				.map((valid, i) => (!valid ? i : undefined))
				.filter((a) => a !== undefined);
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
		if (!$CreasePattern || !$CreasePattern.edges_vertices) {
			return [];
		}
		try {
			return verticesFlatFoldableMaekawa($CreasePattern)
				.map((valid, i) => (!valid ? i : undefined))
				.filter((a) => a !== undefined);
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
export const CPFacesWinding = derived(
	CreasePattern,
	($CreasePattern) => {
		try {
			// console.log("Model: CPFacesWinding");
			return $CreasePattern &&
				$CreasePattern.faces_vertices &&
				$CreasePattern.faces_vertices.length &&
				$CreasePattern.vertices_coords &&
				$CreasePattern.vertices_coords.length
				? makeFacesWinding($CreasePattern)
				: [];
		} catch (error) {
			console.warn("CPFacesWinding", error);
			return [];
		}
	},
	[],
);
/**
 *
 */
export const FoldAnglesAreFlat = derived(
	CreasePattern,
	($CreasePattern) => {
		try {
			return $CreasePattern
				? edgesFoldAngleAreAllFlat($CreasePattern || {})
				: true;
		} catch (error) {
			console.warn("FoldAnglesAreFlat", error);
		}
	},
	true,
);
/**
 *
 */
const VerticesFoldable = derived(
	[CreasePattern, FoldAnglesAreFlat],
	([$CreasePattern, $FoldAnglesAreFlat]) => {
		if ($FoldAnglesAreFlat) {
			return [];
		}
		try {
			return verticesFoldable($CreasePattern, 1e-3)
				.map((valid, i) => (!valid ? i : undefined))
				.filter((a) => a !== undefined);
		} catch (error) {
			console.warn("VerticesFoldable", error);
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
	($VerticesFoldable) =>
		$VerticesFoldable
			.map((valid, v) => (!valid ? v : undefined))
			.filter((a) => a !== undefined),
	[],
);
/**
 *
 */
export const IsFlatFoldable = derived(
	[FoldAnglesAreFlat, InvalidKawasaki, InvalidMaekawa],
	([$FoldAnglesAreFlat, $InvalidKawasaki, $InvalidMaekawa]) =>
		$FoldAnglesAreFlat && !$InvalidKawasaki.length && !$InvalidMaekawa.length,
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
	[FoldAnglesAreFlat, IsFlatFoldable, Is3DFoldable],
	([$FoldAnglesAreFlat, $IsFlatFoldable, $Is3DFoldable]) =>
		$FoldAnglesAreFlat ? $IsFlatFoldable : $Is3DFoldable,
	true,
);
