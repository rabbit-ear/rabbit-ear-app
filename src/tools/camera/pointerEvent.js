import { subtract2 } from "rabbit-ear/math/vector.js";
import {
	makeMatrix2Translate,
	multiplyMatrices2,
} from "rabbit-ear/math/matrix2.js";
import { get } from "svelte/store";
import { getScreenPoint } from "../../js/matrix.js";
import { CameraMatrix } from "../../stores/ViewBox.js";

let press;

const pointerEventCamera = (eventType, { point }) => {
	const screenPoint = getScreenPoint(point);
	switch (eventType) {
	case "press":
		press = screenPoint;
		break;
	case "move":
		if (press === undefined) { break; }
		const m = multiplyMatrices2(
			get(CameraMatrix),
			makeMatrix2Translate(...subtract2(screenPoint, press)),
		);
		CameraMatrix.set(m);
		break;
	case "release": break;
	}
};

export default pointerEventCamera;
