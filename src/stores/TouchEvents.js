import {
	get,
	derived,
	readable,
} from "svelte/store";
import {
	makeMatrix2UniformScale,
	multiplyMatrices2,
	determinant2,
} from "rabbit-ear/math/matrix2.js";
import { getScreenPoint } from "../js/matrix.js";
import {
	CameraMatrixCP,
	CameraMatrixFolded,
	ModelMatrixCP,
	ModelMatrixFolded,
} from "./ViewBox.js";
import {
	Tool,
	Pointer,
} from "./UI.js";
import {
	SVGFoldedFormPointerEvent,
	WebGLFoldedFormPointerEvent,
	SimulatorPointerEvent,
} from "./FoldedFormEvents.js";
// todo: figure out how to scroll the view if there is a mouse
// and the user right-clicks. exactly like how the keyboard "alt"
// can trigger a temporary camera tool motion.

/**
 * @description When a pointer event fires from an SVG canvas (mousedown,
 * mousemove, mouseup), this causes these methods to be called, no matter
 * which UI tool is selected. Generally, these apply to the app itself.
 * Currently, this is so small, it's almost unjustified (it's possible we
 * can move the Pointer.set into the tools themselves, although, this would
 * be duplicating this one line of code in >20x places around the app).
 */
const AppPointerEvent = readable((eventType, event) => {
	Pointer.set(event.point);
	// here. if button 2 is pressed, pan camera around and return true
	return false;
});
/**
 * @description When a pointer event fires from an SVG canvas (mousedown,
 * mousemove, mouseup), the currently-selected UI tool is checked, and
 * in the case that it has a custom pointer event, it gets called here.
 */
const ToolPointerEvent = derived(
	Tool,
	($Tool) => $Tool && $Tool.pointerEvent
		? $Tool.pointerEvent
		: () => {},
	() => {},
);
/**
 * @description SVG canvas pointer event (mousedown, mousemove, mouseup)
 * gets bound to this, which runs any app-wide pointer methods, and checks
 * if there is a UI tool with a pointer event, call the tool's pointer event.
 */
export const PointerEventCP = derived(
	[AppPointerEvent, ToolPointerEvent],
	([$AppPointerEvent, $ToolPointerEvent]) => (eventType, event) => {
		if ($AppPointerEvent(eventType, event)) { return; }
		$ToolPointerEvent(eventType, event);
	},
	() => {},
);
export const PointerEventFolded = derived(
	[AppPointerEvent, ToolPointerEvent],
	([$AppPointerEvent, $ToolPointerEvent]) => (eventType, event) => {
		if ($AppPointerEvent(eventType, event)) { return; }
		// $ToolPointerEvent(eventType, event);
		SVGFoldedFormPointerEvent(eventType, event);
	},
	() => {},
);
/**
 * @description SVG canvas scrolling event gets bound to this.
 */
export const ScrollEventCP = readable(({ point, wheelDelta }) => {
	const scaleOffset = (wheelDelta / 666);
	const scale = 1 + scaleOffset;
	// the input point is in ModelViewMatrix space,
	// which includes ModelMatrix. But, in the upcoming line we are only
	// applying a change to the CameraMatrix. So, before we modify the
	// CameraMatrix with this point, we need to "remove" the ModelMatrix
	// out of this point (multiply by the inverse of ModelMatrix).
	const matrix = makeMatrix2UniformScale(
		scale,
		getScreenPoint(point, get(ModelMatrixCP)),
	);
	CameraMatrixCP.update(cam => {
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
/**
 * @description
 */
export const ScrollEventFolded = readable(({ point, wheelDelta }) => {
	const scaleOffset = (wheelDelta / 666);
	const scale = 1 + scaleOffset;
	// the input point is in ModelViewMatrix space,
	// which includes ModelMatrix. But, in the upcoming line we are only
	// applying a change to the CameraMatrix. So, before we modify the
	// CameraMatrix with this point, we need to "remove" the ModelMatrix
	// out of this point (multiply by the inverse of ModelMatrix).
	const matrix = makeMatrix2UniformScale(
		scale,
		getScreenPoint(point, get(ModelMatrixFolded)),
	);
	CameraMatrixFolded.update(cam => {
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
