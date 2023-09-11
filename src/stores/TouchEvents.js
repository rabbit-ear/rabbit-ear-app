import {
	derived,
	readable,
} from "svelte/store";
import {
	makeMatrix2UniformScale,
	multiplyMatrices2,
	determinant2,
} from "rabbit-ear/math/matrix2.js";
import { getScreenPoint } from "../js/matrix.js";
import { CameraMatrix } from "./ViewBox.js";
import {
	Tool,
	Pointer,
	// PointerSnap,
} from "./UI.js";

// todo: figure out how to scroll the view if there is
// a mouse, and the user right-clicks.

const ToolPointerEvent = derived(
	Tool,
	($Tool) => $Tool && $Tool.pointerEvent
		? $Tool.pointerEvent
		: () => {},
	() => {},
);

const AppPointerEvent = readable((eventType, event) => {
	Pointer.set(event.point);
	// PointerSnap.set(undefined);
});

export const PointerEvent = derived(
	[AppPointerEvent, ToolPointerEvent],
	([$AppPointerEvent, $ToolPointerEvent]) => (eventType, event) => {
		$AppPointerEvent(eventType, event);
		$ToolPointerEvent(eventType, event);
	},
	() => {},
);

export const ScrollEvent = readable(({ point, wheelDelta }) => {
	const scaleOffset = (wheelDelta / 1000);
	const scale = 1 + scaleOffset;
	// the input point is in ModelViewMatrix space,
	// which includes ModelMatrix. But, in the upcoming line we are only
	// applying a change to the CameraMatrix. So, before we modify the
	// CameraMatrix with this point, we need to "remove" the ModelMatrix
	// out of this point (multiply by the inverse of ModelMatrix).
	const matrix = makeMatrix2UniformScale(scale, getScreenPoint(point));
	CameraMatrix.update(cam => {
		// safety check.
		// if the determininat is too small, return unchanged matrix
		// the reason is because the viewMatrix is built from the
		// inverse of this matrix, a bad det makes an invalid inverse.
		const newMatrix = multiplyMatrices2(cam, matrix);
		const det = determinant2(newMatrix)
		const tooSmall = Math.abs(det) < 1e-11;
		const tooLarge = Math.abs(det) > 1e+11;
		if (tooSmall) { return [1e-5, 0, 0, 1e-5, cam[4], cam[5]]; }
		if (tooLarge) { return [1e+5, 0, 0, 1e+5, 0, 0]; }
		return newMatrix;
	});
});
