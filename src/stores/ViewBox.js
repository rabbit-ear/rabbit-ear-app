import { get, writable, derived } from "svelte/store";
import {
	identity2x3,
	invertMatrix2,
	multiplyMatrices2,
	multiplyMatrix2Vector2,
} from "rabbit-ear/math/matrix2.js";
import { graphToMatrix2 } from "../js/matrix.js";

// This approach does not work under the current arrangement,
// the ModelViewMatrix will update every single time the graph changes,
// in most cases this doesn't matter, except when the graph changes size.
// When a line is added outside the current bounds the effect is that
// the canvas jumps into a new position and is disorienting.
// Otherwise, this would be ideal, so, in case a more elegant work-around
// is found, I'm leaving this here for now.
// export const ModelMatrix = derived(
// 	CreasePattern,
// 	($CreasePattern) => graphToMatrix2($CreasePattern),
// 	[...identity2x3],
// );
/**
 * @description The model matrix is intended to describe a bounding box
 * around the graph model. This model matrix will always maintain
 * a 1:1 aspect ratio. Used to create the SVG's ViewBox.
 */
export const ModelMatrix = writable([...identity2x3]);
ModelMatrix.reset = () => ModelMatrix.set([...identity2x3]);
/**
 * @description The camera matrix is what the user modifies when they
 * pan around and scroll to zoom on the SVG canvas.
 */
export const CameraMatrix = writable([...identity2x3]);
CameraMatrix.reset = () => CameraMatrix.set([...identity2x3]);
/**
 * @description The inverse of the camera matrix,
 * used to build the SVG's ViewBox.
 */
export const ViewMatrix = derived(
	CameraMatrix,
	($CameraMatrix) => invertMatrix2($CameraMatrix),
	[...identity2x3],
);
/**
 * @description In a typical fashion, the model and view matrices are
 * multiplied together to make this model-view matrix.
 */
export const ModelViewMatrix = derived(
	[ModelMatrix, ViewMatrix],
	([$ModelMatrix, $ViewMatrix]) => multiplyMatrices2($ModelMatrix, $ViewMatrix),
	[...identity2x3],
);
/**
 * @description The SVG will set its "viewBox" property with this value,
 * a value which is based on the camera, as well as the model size.
 */
export const ViewBox = derived(
	ModelViewMatrix,
	($ModelViewMatrix) => {
		const m = [...$ModelViewMatrix];
		// get the translation component
		const [, , , , x, y] = m;
		// remove the translation component
		m[4] = m[5] = 0;
		// multiply by unit basis vectors
		const [w, h] = multiplyMatrix2Vector2(m, [1, 1]);
		return [x, y, w, h];
	},
	[0, 0, 1, 1],
);
