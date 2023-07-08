import { scale2 } from "rabbit-ear/math/algebra/vector.js";
import {
	// multiplyMatrix2Vector2,
	makeMatrix2UniformScale,
	multiplyMatrices2,
} from "rabbit-ear/math/algebra/matrix2.js";
import { get } from "svelte/store";
import { execute } from "./app.js";
import {
	viewBox,
	viewMatrix,
} from "../stores/viewBox.js";

export const scrollEvent = ({ point, wheelDelta }) => {
	const box = get(viewBox);
	const scaleOffset = -(wheelDelta / 300);// * (wheelDelta > 0 ? 1 : -1);
	const scale = 1 + scaleOffset;
	//
	// const scaled = scale2([box[2], box[3]], scale);
	// const newViewBox = [box[0], box[1], scaled[0], scaled[1]];
	// viewBox.set(newViewBox);
	//
	const vm = get(viewMatrix);
	const currentOrigin = [vm[4], vm[5]];
	const m = makeMatrix2UniformScale(scale, point);
	// const newOrigin = multiplyMatrix2Vector2(m, [box[0], box[1]]);
	// const newSize = multiplyMatrix2Vector2(m, [box[2], box[3]]);
	const newViewMatrix = multiplyMatrices2(m, vm);
	viewMatrix.set(newViewMatrix);
};
