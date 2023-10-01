import {
	invertMatrix4,
	multiplyMatrix4Vector3,
} from "rabbit-ear/math/matrix4.js";
import {
	multiplyMatrix2Vector2,
} from "rabbit-ear/math/matrix2.js";
/**
 * @description Convert a point on a canvas into a 2D vector in the
 * projection space that points from the center of the canvas
 * to the user-supplied point.
 * This will work for any projection, orthographic or perspective.
 * @param {number[]} point a 2D point in canvas space,
 * typically event.offsetX/event.offsetY.
 * @param {number[]} canvasSize the width and height of the canvas
 * element size in pixels.
 * @param {number[]} the 4x4 projection matrix currently being used.
 */
export const vectorFromScreenLocation = (point, canvasSize, projectionMatrix) => {
	const inverse = invertMatrix4(projectionMatrix);
	// remap each axis of point between 0 and 1.
	// (0, 0) is top left, (1, 1) is bottom right
	const screenPoint = [0, 1].map(i => point[i] / canvasSize[i]);
	// a vector from the center of the screen to the screen point.
	// the min/max values of the vector, for each axis, are now between -1 and 1.
	const screenVector = multiplyMatrix2Vector2([-2, 0, 0, 2, 1, -1], screenPoint);
	// the result is the vector from the center of the screen to the pointer,
	// now in corrected world-coordinates (aspect ratio is correct).
	// however it is still in 2D, as a flat screen is really only a 2D surface.
	return multiplyMatrix4Vector3(inverse, [...screenVector, 1]).slice(0, 2);
};
