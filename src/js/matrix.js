import { get } from "svelte/store";
import { boundingBox } from "rabbit-ear/graph/boundary.js";
import {
	identity2x3,
	invertMatrix2,
	multiplyMatrix2Vector2,
} from "rabbit-ear/math/algebra/matrix2.js";
import { ModelMatrix } from "../stores/ViewBox.js";

export const graphToMatrix2 = (graph) => {
	const box = boundingBox(graph);
	// no vertices
	if (!box || !box.span || !box.min) { return [...identity2x3]; }
	// degenerate vertices
	const vmax = Math.max(box.span[0], box.span[1]);
	if (vmax < 1e-6 || !isFinite(box.min[0]) || !isFinite(box.min[1])
		|| !isFinite(box.span[0]) || !isFinite(box.span[1])) {
		return [...identity2x3];
	}
	// console.log("model matrix", [vmax, 0, 0, vmax, box.min[0], box.min[1]]);
	return [vmax, 0, 0, vmax, box.min[0], box.min[1]];
};
/**
 * @description The input point is in ModelViewMatrix space,
 * which includes ModelMatrix. But, in the upcoming line we are only
 * applying a change to the CameraMatrix. So, before we modify the
 * CameraMatrix with this point, we need to "remove" the ModelMatrix
 * out of this point (multiply by the inverse of ModelMatrix).
 */
export const getScreenPoint = (point) => {
	const inverseModelMatrix = invertMatrix2(get(ModelMatrix));
	return inverseModelMatrix === undefined
		? point
		: multiplyMatrix2Vector2(inverseModelMatrix, point);
};
