import { subtract2 } from "rabbit-ear/math/algebra/vector.js";
import {
	makeMatrix2Translate,
	multiplyMatrices2,
} from "rabbit-ear/math/algebra/matrix2.js";
import { get } from "svelte/store";
import { cameraMatrix } from "../stores/viewBox.js";
import {
	current,
	presses,
	moves,
	releases,
} from "../stores/ui.js";

export const pointerEventCamera = (eventType) => {
	const point = get(current);
	switch (eventType) {
	case "press": break;
	case "move":
		if (!get(presses).length) { break; }
		const m = multiplyMatrices2(
			get(cameraMatrix),
			makeMatrix2Translate(...subtract2(point, get(presses)[0]))
		);
		cameraMatrix.set(m);
		break;
	case "release":
		presses.set([]);
		moves.set([]);
		releases.set([]);
		break;
	}
};
