import {
	makeMatrix2UniformScale,
	multiplyMatrices2,
} from "rabbit-ear/math/algebra/matrix2.js";
import { CameraMatrix } from "../stores/ViewBox.js";

export const scrollEvent = ({ point, wheelDelta }) => {
	const scaleOffset = (wheelDelta / 300);
	const scale = 1 + scaleOffset;
	const matrix = makeMatrix2UniformScale(scale, point);
	CameraMatrix.update(m => multiplyMatrices2(m, matrix));
};
