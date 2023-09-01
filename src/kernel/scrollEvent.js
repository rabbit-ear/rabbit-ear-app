import { get } from "svelte/store";
import {
	makeMatrix2UniformScale,
	multiplyMatrices2,
	determinant2,
} from "rabbit-ear/math/matrix2.js";
import { CameraMatrix } from "../stores/ViewBox.js";
import { getScreenPoint } from "../js/matrix.js";

export const scrollEvent = ({ point, wheelDelta }) => {
	const scaleOffset = (wheelDelta / 300);
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
};
