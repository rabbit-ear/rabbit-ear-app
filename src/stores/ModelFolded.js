import { writable, derived } from "svelte/store";
import { linearize2DFaces } from "rabbit-ear/graph/orders.js";
import {
	makeVerticesCoordsFolded,
	makeVerticesCoordsFlatFolded,
} from "rabbit-ear/graph/vertices/folded.js";
import { makeFacesWinding } from "rabbit-ear/graph/faces/winding.js";
import { planarizeAllFaces } from "rabbit-ear/graph/planarize/planarize.js";
// import { validate } from "rabbit-ear/graph/validate.js";
import { graphToMatrix2 } from "../js/matrix.js";
import { solveFaceLayers, solveFaceLayersWorker } from "../js/orders.js";
import { ModelMatrixFolded } from "./ViewBox.js";
import { VerticalUp, AutoSolveLayers, SolveLayersOnBackground } from "./App.js";
import { IsolatedFrame, FrameIsCreasePattern } from "./Model.js";
import { CreasePattern, FoldAnglesAreFlat } from "./ModelCP.js";
/**
 *
 */
export const FrameHasFaceOrders = derived(
	IsolatedFrame,
	($IsolatedFrame) => $IsolatedFrame && $IsolatedFrame.faceOrders,
	false,
);
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
			if (
				$CreasePattern &&
				$CreasePattern.vertices_coords &&
				$CreasePattern.edges_vertices &&
				$CreasePattern.faces_vertices
			) {
				// console.log("Model: ComputedFoldedCoords");
				return $FoldAnglesAreFlat
					? makeVerticesCoordsFlatFolded($CreasePattern, [$FoldedRootFace])
					: makeVerticesCoordsFolded($CreasePattern, [$FoldedRootFace]);
			}
			return [];
		} catch (error) {
			console.warn("ComputedFoldedCoords", error);
			return [];
		}
	},
	[],
);

// async derived Svelte store example
// export default function (stores, callback, initial_value) {
// 	let guardOrder
// 	return derived(stores, ($stores, set) => {
// 		const innerGuard = guardOrder = {}
// 		set(initial_value)
// 		Promise.resolve(callback($stores)).then(value => {
// 			if (guardOrder === innerGuard) {
// 				set(value)
// 			}
// 		})
// 	}, initial_value)
// }

let guardOrder;

export const FaceOrdersSolution = derived(
	[
		IsolatedFrame,
		ComputedFoldedCoords,
		FrameIsCreasePattern,
		AutoSolveLayers,
		SolveLayersOnBackground,
	],
	(
		[
			$IsolatedFrame,
			$ComputedFoldedCoords,
			$FrameIsCreasePattern,
			$AutoSolveLayers,
			$SolveLayersOnBackground,
		],
		set,
	) => {
		// don't re-compute the solution if "faceOrders" already exists
		if ($IsolatedFrame && $IsolatedFrame.faceOrders) {
			return {};
		}
		const innerGuard = (guardOrder = {});
		set({});
		if (!$AutoSolveLayers) {
			return {};
		}
		const foldedForm = !$FrameIsCreasePattern
			? $IsolatedFrame
			: {
					...$IsolatedFrame,
					vertices_coords: $ComputedFoldedCoords,
					frame_classes: ["foldedForm"],
				};
		const Solve = $SolveLayersOnBackground
			? solveFaceLayersWorker
			: solveFaceLayers;
		Promise.resolve(Solve(foldedForm)).then(
			(value) => {
				if (guardOrder === innerGuard) {
					set(value);
				} else {
					// console.log("FaceOrdersSolution, guardOrder !== innerGuard")
				}
			},
			(error) => {
				console.warn("FaceOrdersSolution", error);
				set({});
			},
		);
	},
	{},
);

// export const FaceOrdersSolution = derived(
// 	[IsolatedFrame, ComputedFoldedCoords, FrameIsCreasePattern, AutoSolveLayers],
// 	([$IsolatedFrame, $ComputedFoldedCoords, $FrameIsCreasePattern, $AutoSolveLayers]) => {
// 		if (!$AutoSolveLayers) { return {}; }
// 		try {
// 			const foldedForm = !$FrameIsCreasePattern
// 				? $IsolatedFrame
// 				: {
// 					...$IsolatedFrame,
// 					vertices_coords: $ComputedFoldedCoords,
// 					frame_classes: ["foldedForm"],
// 				};
// 			return solveFaceLayers(foldedForm);
// 		} catch (error) {
// 			console.warn("FaceOrdersSolution", error);
// 		}
// 	}
// );

export const FaceOrdersOptions = writable([]);

export const FaceOrders = derived(
	[IsolatedFrame, FaceOrdersSolution, FaceOrdersOptions],
	([$IsolatedFrame, $FaceOrdersSolution, $FaceOrdersOptions]) => {
		if ($IsolatedFrame && $IsolatedFrame.faceOrders) {
			// console.log("FaceOrders $IsolatedFrame.faceOrders");
			return $IsolatedFrame.faceOrders;
		}
		if (!$FaceOrdersSolution || !$FaceOrdersSolution.faceOrders) {
			// console.log("FaceOrders []");
			return undefined;
		}
		try {
			// $FaceOrdersOptions
			return $FaceOrdersSolution.faceOrders();
			// const computed = $FaceOrdersSolution.faceOrders();
			// console.log("FaceOrders computed", computed);
			// return computed;
		} catch (error) {
			console.warn("FaceOrders", error);
		}
		return undefined;
	},
);

/**
 * @description The FoldedForm will be one of two things:
 * - the current frame in the FOLD file untouched, if that frame is "foldedForm"
 * - a computed state, if the current frame is "creasePattern", then we
 *   use the folded vertices to assemble a folded representation of the CP.
 */
export const FoldedForm = derived(
	[
		FrameIsCreasePattern,
		IsolatedFrame,
		ComputedFoldedCoords,
		FaceOrders,
		VerticalUp,
	],
	([
		$FrameIsCreasePattern,
		$IsolatedFrame,
		$ComputedFoldedCoords,
		$FaceOrders,
		$VerticalUp,
	]) => {
		// console.log("Model: FoldedForm");
		// if the frame is a folded form, return the frame itself.
		// otherwise, compute the folded form from the crease pattern.
		const foldedForm = !$FrameIsCreasePattern
			? $IsolatedFrame
			: {
					...$IsolatedFrame, // ...structuredClone($IsolatedFrame),
					vertices_coords: $ComputedFoldedCoords,
					faceOrders: $FaceOrders,
					frame_classes: ["foldedForm"],
				};
		if (foldedForm.faceOrders === undefined) {
			delete foldedForm.faceOrders;
		}
		ModelMatrixFolded.set(graphToMatrix2(foldedForm, $VerticalUp));
		return foldedForm;
	},
	{},
);

// const ValidateTest = derived(
// 	FoldedForm,
// 	($FoldedForm) => {
// 		const errors = validate($FoldedForm);
// 		if (errors.length) { console.log(structuredClone($FoldedForm)); }
// 		console.log("validator", errors);
// 	},
// 	undefined
// );

// ValidateTest.subscribe(() => {});

/**
 *
 */
export const FoldedFormPlanar = derived(
	[FoldedForm, FoldAnglesAreFlat],
	([$FoldedForm, $FoldAnglesAreFlat]) => {
		try {
			// console.log("Model: FoldedFormPlanar");
			return $FoldAnglesAreFlat ? planarizeAllFaces($FoldedForm) : {};
		} catch (error) {}
		return {};
	},
	{},
);
/**
 *
 */
export const Faces2DDrawOrder = derived(
	[FoldedForm, FoldedRootFace, FoldAnglesAreFlat],
	([$FoldedForm, $FoldedRootFace, $FoldAnglesAreFlat]) => {
		// if no faceOrders exist, return empty array.
		if (!$FoldedForm || !$FoldedForm.faceOrders) {
			return [];
		}
		if (
			$FoldedForm.vertices_coords &&
			$FoldedForm.faces_vertices &&
			$FoldAnglesAreFlat
		) {
			try {
				return linearize2DFaces($FoldedForm, $FoldedRootFace);
			} catch (error) {
				console.warn("Faces2DDrawOrder", error);
			}
		}
		// return $FoldedForm && $FoldedForm.faces_vertices
		// 	? $FoldedForm.faces_vertices.map((_, i) => i)
		// 	: []
		return [];
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
			return $FoldedForm &&
				$FoldedForm.faces_vertices &&
				$FoldedForm.faces_vertices.length &&
				$FoldedForm.vertices_coords &&
				$FoldedForm.vertices_coords.length
				? makeFacesWinding($FoldedForm)
				: [];
		} catch (error) {
			console.warn("FoldedFacesWinding", error);
			return [];
		}
	},
	[],
);
