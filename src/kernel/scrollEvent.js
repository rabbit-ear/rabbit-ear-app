import { scale2 } from "rabbit-ear/math/algebra/vector.js";
import {
	makeMatrix2UniformScale,
	multiplyMatrices2,
} from "rabbit-ear/math/algebra/matrix2.js";
import { get } from "svelte/store";
import { execute } from "./app.js";
import { cameraMatrix } from "../stores/viewBox.js";

export const scrollEvent = ({ point, wheelDelta }) => {
	const scaleOffset = (wheelDelta / 300);
	const scale = 1 + scaleOffset;
	const m = multiplyMatrices2(
		get(cameraMatrix),
		makeMatrix2UniformScale(scale, point),
	);
	cameraMatrix.set(m);
};
