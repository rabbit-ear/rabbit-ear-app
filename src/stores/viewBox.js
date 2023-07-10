import { get } from "svelte/store";
import { writable, derived } from "svelte/store";
import {
	identity2x3,
	invertMatrix2,
	multiplyMatrices2,
	multiplyMatrix2Vector2,
} from "rabbit-ear/math/algebra/matrix2.js";

export const modelMatrix = writable([...identity2x3]);

export const cameraMatrix = writable([...identity2x3]);

export const viewMatrix = derived(
	cameraMatrix,
	($cameraMatrix) => invertMatrix2($cameraMatrix),
	[...identity2x3],
);

export const modelViewMatrix = derived(
	[modelMatrix, viewMatrix],
	([$modelMatrix, $viewMatrix]) => multiplyMatrices2($modelMatrix, $viewMatrix),
	[...identity2x3],
);

export const viewBox = derived(
	modelViewMatrix,
	($modelViewMatrix) => {
		const m = [...$modelViewMatrix];
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
