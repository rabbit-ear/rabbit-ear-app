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
	makeMatrix2Translate,
	makeMatrix2UniformScale,
} from "rabbit-ear/math/matrix2.js";

// const VerticalUpOnBoot = localStorage.getItem("VerticalUp") !== null
// 	? localStorage.getItem("VerticalUp") === "true"
// 	: true;
// const Identity2x3 = VerticalUpOnBoot
// 	? [1, 0, 0, 1, 0, -1]
// 	: [1, 0, 0, 1, 0, 0];

const Identity2x3 = identity2x3; // [1, 0, 0, 1, 0, -1];

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
// 	[...Identity2x3],
// );
/**
 * @description The model matrix is intended to describe a bounding box
 * around the graph model. This model matrix will always maintain
 * a 1:1 aspect ratio. Used to create the SVG's ViewBox.
 */
export const ModelMatrixCP = writable([...Identity2x3]);
ModelMatrixCP.reset = () => ModelMatrixCP.set([...identity2x3]);
const ModelMatrixCPSet = ModelMatrixCP.set;
ModelMatrixCP.set = (matrix) => {
	// We are about to set the model matrix, and the new model matrix
	// will be fed into the ModelViewMatrix which affects the viewport,
	// however, we want the view to not move, but we can't abort the
	// changes to the model matrix, instead, we have to compute the
	// difference between the two model matrices before and after update,
	// and apply the inverse of the difference to the viewport.
	// Unfortunately we don't set the viewport, we don't set the view
	// matrix either, we set the camera matrix, but the camera is the
	// inverse of the view matrix, simple enough.
	// ModelView = Model * View = Model * inv(Camera)
	// newModel = oldModel * Difference
	// oldModelView = oldModel * View
	// newModelView = (oldModel * Difference) * View
	// we want: newModelView = oldModelView
	// we can't modify model matrix, but we can modify the view matrix
	// oldModelView = oldModel * View
	// newModelView = (oldModel * Difference) * View
	// newModelView = (oldModel * Difference) * (View * inv(Difference))
	// which factors into
	// newModelView = oldModel * View * Difference * inv(Difference)
	// newModelView = oldModel * View
	// which is what we want. (god i think rearranging matrices is wrong)
	// but anyway, View needs to become View * inv(Difference)
	// View is inv(Camera), so: inv(Camera) * inv(Difference)
	// can that simplify into: Camera * Difference?
	// then take the inverse to get the view again?
	const old = get(ModelMatrixCP);
	const scale = matrix[0] / old[0];
	const x = (matrix[4] - old[4]) / old[0];
	const y = (matrix[5] - old[5]) / old[0];
	const difference = [scale, 0, 0, scale, x, y];
	const cameraMatrix = get(CameraMatrixCP);
	const newCameraMatrix = multiplyMatrices2(cameraMatrix, difference);
	CameraMatrixCP.set(newCameraMatrix);
	return ModelMatrixCPSet(matrix);
};

export const ModelMatrixFolded = writable([...Identity2x3]);
ModelMatrixFolded.reset = () => ModelMatrixFolded.set([...identity2x3]);

/**
 * @description The camera matrix is what the user modifies when they
 * pan around and scroll to zoom on the SVG canvas.
 */
export const CameraMatrixCP = writable([...Identity2x3]);
CameraMatrixCP.reset = () => CameraMatrixCP.set([...identity2x3]);

export const CameraMatrixFolded = writable([...Identity2x3]);
CameraMatrixFolded.reset = () => CameraMatrixFolded.set([...identity2x3]);

// this "identity" matrix is for the ViewMatrix and positions the camera
// in the negative z axis looking directly at the model.
// This works for both perspective and orthographic.
const GL_IDENTITY = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -2, 1];
export const WebGLViewMatrix = writable([...GL_IDENTITY]);
WebGLViewMatrix.reset = () => WebGLViewMatrix.set([...GL_IDENTITY]);

/**
 * @description The inverse of the camera matrix,
 * used to build the SVG's ViewBox.
 */
export const ViewMatrixCP = derived(
	CameraMatrixCP,
	($CameraMatrixCP) => invertMatrix2($CameraMatrixCP),
	[...Identity2x3],
);

export const ViewMatrixFolded = derived(
	CameraMatrixFolded,
	($CameraMatrixFolded) => invertMatrix2($CameraMatrixFolded),
	[...Identity2x3],
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
	[...Identity2x3],
);

export const ModelViewMatrixFolded = derived(
	[ModelMatrixFolded, ViewMatrixFolded],
	([$ModelMatrixFolded, $ViewMatrixFolded]) => (
		multiplyMatrices2($ModelMatrixFolded, $ViewMatrixFolded)
	),
	[...Identity2x3],
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
