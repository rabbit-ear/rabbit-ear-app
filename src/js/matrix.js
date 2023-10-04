import { get } from "svelte/store";
import { boundingBox } from "rabbit-ear/graph/boundary.js";
import {
	identity2x3,
	invertMatrix2,
	multiplyMatrix2Vector2,
} from "rabbit-ear/math/matrix2.js";
/**
 *
 */
export const viewBoxOrigin = (box, invertY = false) => invertY
	? [box[0], box[1]]
	: [box[0], -box[1] - box[3]];
/**
 *
 */
export const graphToMatrix2 = (graph = {}, invertY = false) => {
	const box = boundingBox(graph);
	// no vertices
	if (!box || !box.span || !box.min) { return [...identity2x3]; }
	// degenerate vertices
	const vmax = Math.max(box.span[0], box.span[1]);
	const padding = box.span.map(s => (s - vmax) / 2);
	if (vmax < 1e-6 || !isFinite(box.min[0]) || !isFinite(box.min[1])
		|| !isFinite(box.span[0]) || !isFinite(box.span[1])) {
		return [...identity2x3];
	}
	const translation = [0, 1].map(i => box.min[i] + padding[i]);
	if (!invertY) { translation[1] = -box.max[1] + padding[1]; }
	return [vmax, 0, 0, vmax, translation[0], translation[1]];
};
/**
 * @description The input point is in ModelViewMatrix space,
 * which includes ModelMatrix. But, in the upcoming line we are only
 * applying a change to the CameraMatrix. So, before we modify the
 * CameraMatrix with this point, we need to "remove" the ModelMatrix
 * out of this point (multiply by the inverse of ModelMatrix).
 */
export const getScreenPoint = (point, modelMatrix) => {
	if (point === undefined) { return undefined; }
	const inverseModelMatrix = invertMatrix2(modelMatrix);
	return inverseModelMatrix === undefined
		? point
		: multiplyMatrix2Vector2(inverseModelMatrix, point);
};
