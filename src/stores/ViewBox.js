import {
	get,
	writable,
	derived,
} from "svelte/store";
import {
	identity2x3,
	invertMatrix2,
	multiplyMatrices2,
	multiplyMatrix2Vector2,
} from "rabbit-ear/math/matrix2.js";

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
export const ModelMatrixCP = writable([...identity2x3]);
ModelMatrixCP.reset = () => ModelMatrixCP.set([...identity2x3]);

export const ModelMatrixFolded = writable([...identity2x3]);
ModelMatrixFolded.reset = () => ModelMatrixFolded.set([...identity2x3]);

/**
 * @description The camera matrix is what the user modifies when they
 * pan around and scroll to zoom on the SVG canvas.
 */
export const CameraMatrixCP = writable([...identity2x3]);
CameraMatrixCP.reset = () => CameraMatrixCP.set([...identity2x3]);

export const CameraMatrixFolded = writable([...identity2x3]);
CameraMatrixFolded.reset = () => CameraMatrixFolded.set([...identity2x3]);

/**
 * @description The inverse of the camera matrix,
 * used to build the SVG's ViewBox.
 */
export const ViewMatrixCP = derived(
	CameraMatrixCP,
	($CameraMatrixCP) => invertMatrix2($CameraMatrixCP),
	[...identity2x3],
);

export const ViewMatrixFolded = derived(
	CameraMatrixFolded,
	($CameraMatrixFolded) => invertMatrix2($CameraMatrixFolded),
	[...identity2x3],
);
/**
 * @description In a typical fashion, the model and view matrices are
 * multiplied together to make this model-view matrix.
 */
export const ModelViewMatrixCP = derived(
	[ModelMatrixCP, ViewMatrixCP],
	([$ModelMatrixCP, $ViewMatrixCP]) => (
		multiplyMatrices2($ModelMatrixCP, $ViewMatrixCP)
	),
	[...identity2x3],
);

export const ModelViewMatrixFolded = derived(
	[ModelMatrixFolded, ViewMatrixFolded],
	([$ModelMatrixFolded, $ViewMatrixFolded]) => (
		multiplyMatrices2($ModelMatrixFolded, $ViewMatrixFolded)
	),
	[...identity2x3],
);
/**
 * @description The SVG will set its "viewBox" property with this value,
 * a value which is based on the camera, as well as the model size.
 */
export const ViewportCP = derived(
	ModelViewMatrixCP,
	($ModelViewMatrixCP) => {
		const m = [...$ModelViewMatrixCP];
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

export const ViewportFolded = derived(
	ModelViewMatrixFolded,
	($ModelViewMatrixFolded) => {
		const m = [...$ModelViewMatrixFolded];
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
