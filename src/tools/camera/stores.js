import {
	writable,
	derived,
} from "svelte/store";
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
} from "../../stores/ViewBox.js";

export const Press = writable(undefined);
export const Drag = writable(undefined);

// const PressCoords = derived(Press, getScreenPoint, undefined);
// const DragCoords = derived(Drag, getScreenPoint, undefined);
const PressCoords = derived(
	[Press, ModelMatrixCP],
	([$Press, $ModelMatrixCP]) => getScreenPoint($Press, $ModelMatrixCP),
	undefined,
);
const DragCoords = derived(
	[Drag, ModelMatrixCP],
	([$Drag, $ModelMatrixCP]) => getScreenPoint($Drag, $ModelMatrixCP),
	undefined,
);

export const DragVector = derived(
	[DragCoords, PressCoords],
	([$DragCoords, $PressCoords]) => (!$DragCoords || !$PressCoords)
		? [0, 0]
		: subtract2($DragCoords, $PressCoords),
	[0, 0],
);

export const MoveCamera = derived(
	[DragVector],
	([$DragVector]) => CameraMatrixCP.update(camera => (
		multiplyMatrices2(camera, makeMatrix2Translate(...$DragVector))
	)),
	undefined,
);

export const reset = () => {
	Press.set(undefined);
	Drag.set(undefined);
};

let unsub;

export const subscribe = () => {
	unsub = MoveCamera.subscribe(() => {});
};

export const unsubscribe = () => {
	if (unsub) { unsub(); }
	reset();
};
