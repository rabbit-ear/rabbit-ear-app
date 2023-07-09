import { scale2 } from "rabbit-ear/math/algebra/vector.js";
import {
	// multiplyMatrix2Vector2,
	makeMatrix2Translate,
	makeMatrix2UniformScale,
	multiplyMatrices2,
} from "rabbit-ear/math/algebra/matrix2.js";
import { get } from "svelte/store";
import { execute } from "./app.js";
import { viewMatrix } from "../stores/viewBox.js";

export const scrollEvent = ({ point, wheelDelta }) => {
	const scaleOffset = -(wheelDelta / 300);// * (wheelDelta > 0 ? 1 : -1);
	const scale = 1 + scaleOffset;
	const scaleMatrix = makeMatrix2UniformScale(scale, point);
	viewMatrix.set(multiplyMatrices2(get(viewMatrix), scaleM));

	// const scaleM = makeMatrix2UniformScale(scale);
	// const currentOrigin = [vm[4], vm[5]];
	// const pointM = makeMatrix2Translate(...point);
	// const invPointM = makeMatrix2Translate(-point[0], -point[1]);
	// ((vm * invTrans) * scale) * trans

	// const newViewMatrix = multiplyMatrices2(
	// 	multiplyMatrices2(
	// 		multiplyMatrices2(vm, invTrans), scaleM), trans);

	// const vmScaleOnly = [vm[0], vm[1], vm[2], vm[3], 0, 0];
	// const vmTrans = makeMatrix2Translate(vm[4], vm[5]);

	// const newViewMatrix = multiplyMatrices2(vmTrans,
	// 	multiplyMatrices2(trans,
	// 		multiplyMatrices2(scaleM,
	// 			multiplyMatrices2(invTrans, vmScaleOnly))));

	// const newOrigin = multiplyMatrix2Vector2(m, [box[0], box[1]]);
	// const newSize = multiplyMatrix2Vector2(m, [box[2], box[3]]);
	// const newViewMatrix = multiplyMatrices2(scaleM, vm);
	// viewMatrix.set(newViewMatrix);
};
