import {
	makeMatrix2UniformScale,
	multiplyMatrices2,
	determinant2,
} from "rabbit-ear/math/algebra/matrix2.js";
import { CameraMatrix } from "../stores/ViewBox.js";

export const scrollEvent = ({ point, wheelDelta }) => {
	const scaleOffset = (wheelDelta / 300);
	const scale = 1 + scaleOffset;
	const matrix = makeMatrix2UniformScale(scale, point);
	CameraMatrix.update(m => {
		// safety check.
		// if the determininat is too small, return unchanged matrix
		// the reason is because the viewMatrix is built from the
		// inverse of this matrix, a bad det makes an invalid inverse.
		const newMatrix = multiplyMatrices2(m, matrix);
		const det = determinant2(newMatrix)
		const tooSmall = Math.abs(det) < 1e-11;
		const tooLarge = Math.abs(det) > 1e+11;
		if (tooSmall) { return [1e-5, 0, 0, 1e-5, m[4], m[5]]; }
		if (tooLarge) { return [1e+5, 0, 0, 1e+5, 0, 0]; }
		return newMatrix;
	});
};
