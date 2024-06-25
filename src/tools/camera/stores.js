import { writable, derived } from "svelte/store";
import { subtract2 } from "rabbit-ear/math/vector.js";
import {
	makeMatrix2Translate,
	multiplyMatrices2,
} from "rabbit-ear/math/matrix2.js";
import { getScreenPoint } from "../../js/matrix.js";
import {
	ModelMatrixCP,
	ModelMatrixFolded,
	CameraMatrixCP,
	CameraMatrixFolded,
} from "../../stores/ViewBox.js";
import { VerticalUp } from "../../stores/App.js";

const rewrap = (point, invert) => [point[0], point[1] * (invert ? -1 : 1)];

export const CPPress = writable(undefined);
export const CPDrag = writable(undefined);
export const FoldedPress = writable(undefined);
export const FoldedDrag = writable(undefined);

const CPPressCoords = derived(
	[CPPress, ModelMatrixCP],
	([$CPPress, $ModelMatrixCP]) => getScreenPoint($CPPress, $ModelMatrixCP),
	undefined,
);

const CPDragCoords = derived(
	[CPDrag, ModelMatrixCP],
	([$CPDrag, $ModelMatrixCP]) => getScreenPoint($CPDrag, $ModelMatrixCP),
	undefined,
);

export const CPDragVector = derived(
	[CPDragCoords, CPPressCoords],
	([$CPDragCoords, $CPPressCoords]) =>
		!$CPDragCoords || !$CPPressCoords
			? [0, 0]
			: subtract2($CPDragCoords, $CPPressCoords),
	[0, 0],
);

export const CPMoveCamera = derived(
	[CPDragVector, VerticalUp],
	([$CPDragVector, $VerticalUp]) =>
		CameraMatrixCP.update((camera) =>
			multiplyMatrices2(
				camera,
				makeMatrix2Translate(...rewrap($CPDragVector, $VerticalUp)),
			),
		),
	undefined,
);

// ////////////////////

const FoldedPressCoords = derived(
	[FoldedPress, ModelMatrixFolded],
	([$FoldedPress, $ModelMatrixFolded]) =>
		getScreenPoint($FoldedPress, $ModelMatrixFolded),
	undefined,
);

const FoldedDragCoords = derived(
	[FoldedDrag, ModelMatrixFolded],
	([$FoldedDrag, $ModelMatrixFolded]) =>
		getScreenPoint($FoldedDrag, $ModelMatrixFolded),
	undefined,
);

export const FoldedDragVector = derived(
	[FoldedDragCoords, FoldedPressCoords],
	([$FoldedDragCoords, $FoldedPressCoords]) =>
		!$FoldedDragCoords || !$FoldedPressCoords
			? [0, 0]
			: subtract2($FoldedDragCoords, $FoldedPressCoords),
	[0, 0],
);

export const FoldedMoveCamera = derived(
	[FoldedDragVector, VerticalUp],
	([$FoldedDragVector, $VerticalUp]) =>
		CameraMatrixFolded.update((camera) =>
			multiplyMatrices2(
				camera,
				makeMatrix2Translate(...rewrap($FoldedDragVector, $VerticalUp)),
			),
		),
	undefined,
);

// /////////////////////////

export const reset = () => {
	CPPress.set(undefined);
	CPDrag.set(undefined);
	FoldedPress.set(undefined);
	FoldedDrag.set(undefined);
};

let unsub = [];

export const subscribe = () => {
	unsub = [
		CPMoveCamera.subscribe(() => {}),
		FoldedMoveCamera.subscribe(() => {}),
	];
};

export const unsubscribe = () => {
	unsub.forEach((fn) => fn());
	unsub = [];
	reset();
};
