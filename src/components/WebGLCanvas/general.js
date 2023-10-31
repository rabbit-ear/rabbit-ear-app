import {
	magnitude2,
	subtract2,
} from "rabbit-ear/math/vector.js";
import {
	multiplyMatrix2Vector2,
} from "rabbit-ear/math/matrix2.js";
import {
	invertMatrix4,
	makeMatrix4Scale,
	makeMatrix4Translate,
	multiplyMatrices4,
	multiplyMatrix4Vector3,
} from "rabbit-ear/math/matrix4.js";
import {
	quaternionFromTwoVectors,
	matrix4FromQuaternion,
} from "rabbit-ear/math/quaternion.js";
/**
 * @description sensitivity for pan rotation gesture
 */
const SENSITIVITY = 0.075;
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
/**
 *
 */
export const rotateViewMatrix = (perspective, viewMatrix, vector, prevVector) => {
	switch (perspective) {
	case "perspective":
		const vectors = [
			[...prevVector, -SENSITIVITY * Math.atan(1 / magnitude2(prevVector))],
			[...vector, -SENSITIVITY * Math.atan(1 / magnitude2(vector))]
		];
		const quaternion = quaternionFromTwoVectors(...vectors);
		const matrix = matrix4FromQuaternion(quaternion);
		// return multiplyMatrices4(matrix, viewMatrix);
		// move translation indices out of the matrix, rotate, then put it back in.
		const transIndices = [12, 13, 14];
		const currentTranslation = transIndices.map(i => viewMatrix[i]);
		transIndices.forEach(i => { viewMatrix[i] = 0; });
		const newViewMatrix = multiplyMatrices4(matrix, viewMatrix);
		transIndices.forEach((i, j) => { newViewMatrix[i] = currentTranslation[j]; });
		return newViewMatrix;
	case "orthographic":
		const translateVector = subtract2(vector, prevVector);
		const translate = makeMatrix4Translate(...translateVector);
		const invertTranslate = invertMatrix4(translate);
		return multiplyMatrices4(invertTranslate, viewMatrix);
	default: return viewMatrix;
	}
};
/**
 *
 */
export const zoomViewMatrix = (perspective, viewMatrix, delta) => {
	switch (perspective) {
	case "perspective":
		const translateMatrix = makeMatrix4Translate(0, 0, delta);
		return multiplyMatrices4(translateMatrix, viewMatrix);
	case "orthographic":
		const scale = 1 + delta;
		const scaleMatrix = makeMatrix4Scale([scale, scale, scale]);
		return multiplyMatrices4(scaleMatrix, viewMatrix);
	default: return viewMatrix;
	}
};
