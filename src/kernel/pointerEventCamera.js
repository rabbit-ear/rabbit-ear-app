import { subtract2 } from "rabbit-ear/math/algebra/vector.js";
import {
	makeMatrix2Translate,
	multiplyMatrices2,
} from "rabbit-ear/math/algebra/matrix2.js";
import { get } from "svelte/store";
import { CameraMatrix } from "../stores/ViewBox.js";
import {
	Current,
	Presses,
	Moves,
	Releases,
} from "../stores/UI.js";

export const pointerEventCamera = (eventType) => {
	const point = get(Current);
	switch (eventType) {
	case "press": break;
	case "move":
		if (!get(Presses).length) { break; }
		const m = multiplyMatrices2(
			get(CameraMatrix),
			makeMatrix2Translate(...subtract2(point, get(Presses)[0]))
		);
		CameraMatrix.set(m);
		break;
	case "release":
		Presses.set([]);
		Moves.set([]);
		Releases.set([]);
		break;
	}
};
