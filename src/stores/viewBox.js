import { get } from "svelte/store";
import { writable, derived } from "svelte/store";
import {
	identity2x3,
	multiplyMatrices2,
	multiplyMatrix2Vector2,
} from "rabbit-ear/math/algebra/matrix2.js";

// new plan
// viewbox is a derived state
// derived from 2 things:
// - the matrix which centers and aspect fits the graph in the screen
// - the user matrix for zooming and translating the view around

export const modelMatrix = writable([...identity2x3]);

export const viewMatrix = writable([...identity2x3]);

export const modelViewMatrix = derived(
	[modelMatrix, viewMatrix],
	([$modelMatrix, $viewMatrix]) => multiplyMatrices2($modelMatrix, $viewMatrix),
	[...identity2x3],
);

// const doubled = derived(modelViewMatrix, ($modelViewMatrix) => $modelViewMatrix * 2);

export const viewBox = derived(
	modelViewMatrix,
	($modelViewMatrix) => [
		$modelViewMatrix[4],
		$modelViewMatrix[5],
		// todo: this is weird
		multiplyMatrix2Vector2($modelViewMatrix, [1, 0])[0],
		multiplyMatrix2Vector2($modelViewMatrix, [0, 1])[1],
	],
	[0, 0, 1, 1]);

// const {
// 	subscribe: viewBoxSubscribe,
// 	set: viewBoxSet,
// } = writable([0, 0, 1, 1]);

// export const viewBox = {
// 	subscribe: viewBoxSubscribe,
// 	set: viewBoxSet,
// 	setWidth: (n) => {
// 		let box = get(viewBox);
// 		box[2] = n;
// 		return viewBoxSet([...box]);
// 	},
// 	setHeight: (n) => {
// 		let box = get(viewBox);
// 		box[3] = n;
// 		return viewBoxSet([...box]);
// 	},
// };

