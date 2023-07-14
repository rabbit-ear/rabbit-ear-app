import { writable, derived } from "svelte/store";
import {
	identity2x3,
	invertMatrix2,
	multiplyMatrices2,
	multiplyMatrix2Vector2,
} from "rabbit-ear/math/algebra/matrix2.js";

export const ModelMatrix = writable([...identity2x3]);

export const CameraMatrix = writable([...identity2x3]);

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
