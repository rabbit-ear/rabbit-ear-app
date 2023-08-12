import { subtract2 } from "rabbit-ear/math/algebra/vector.js";
import {
	makeMatrix2Translate,
	multiplyMatrices2,
} from "rabbit-ear/math/algebra/matrix2.js";
import { get } from "svelte/store";
import { CameraMatrix } from "../stores/ViewBox.js";

let press;

export const pointerEventCamera = (eventType, { point }) => {
	switch (eventType) {
	case "press":
		press = point;
		break;
	case "move":
		if (press === undefined) { break; }
		const m = multiplyMatrices2(
			get(CameraMatrix),
			makeMatrix2Translate(...subtract2(point, press)),
		);
		CameraMatrix.set(m);
		break;
	case "release": break;
	}
};