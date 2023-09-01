import { get, writable, derived } from "svelte/store";
import {
	identity2x3,
	invertMatrix2,
	multiplyMatrices2,
	multiplyMatrix2Vector2,
} from "rabbit-ear/math/matrix2.js";
import { graphToMatrix2 } from "../js/matrix.js";

export const AutoSizeModelMatrix = writable(false);

// This approach does not work under the current arrangement,
// the ModelViewMatrix will update every single time the graph changes,
// in most cases this doesn't matter, except when the graph changes size.
// When a line is added outside the current bounds the effect is that
// the canvas jumps into a new position and is disorienting.
// Otherwise, this would be ideal, so, in case a more elegant work-around
// is found, I'm leaving this here for now.
// export const ModelMatrix = derived(
// 	Graph,
// 	($Graph) => graphToMatrix2($Graph),
// 	[...identity2x3],
// );

export const ModelMatrix = writable([...identity2x3]);
ModelMatrix.reset = () => ModelMatrix.set([...identity2x3]);

export const CameraMatrix = writable([...identity2x3]);
CameraMatrix.reset = () => CameraMatrix.set([...identity2x3]);

export const ViewMatrix = derived(
	CameraMatrix,
	($CameraMatrix) => invertMatrix2($CameraMatrix),
	[...identity2x3],
);

export const ModelViewMatrix = derived(
	[ModelMatrix, ViewMatrix],
	([$ModelMatrix, $ViewMatrix]) => multiplyMatrices2($ModelMatrix, $ViewMatrix),
	[...identity2x3],
);

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
