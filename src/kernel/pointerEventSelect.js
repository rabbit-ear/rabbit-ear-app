import { get } from "svelte/store";
import { elementSelect } from "../stores/app.js";
import { selectionRect } from "../stores/select.js";
import {
	presses,
	releases,
	moves,
	keyboard,
} from "../stores/ui.js";
import {
	SELECT_VERTEX,
	SELECT_EDGE,
	SELECT_FACE,
} from "../app/keys.js";
import { getSelected } from "../js/select.js";
import { execute } from "./app.js";

const vefName = {
	[SELECT_VERTEX]: "vertices",
	[SELECT_EDGE]: "edges",
	[SELECT_FACE]: "faces",
};
/**
 *
 */
const rectFromTwoPoints = (p, q) => {
	const xs = [p[0], q[0]].sort((a, b) => a - b);
	const ys = [p[1], q[1]].sort((a, b) => a - b);
	return {
		min: [xs[0], ys[0]],
		max: [xs[1], ys[1]],
		span: [xs[1] - xs[0], ys[1] - ys[0]],
	};
};
/**
 *
 */
export const pointerEventSelect = (eventType) => {
	switch (eventType) {
	case "press":
		selectionRect.set(undefined);
		break;
	case "move":
		if (!get(presses).length || !get(moves).length) {
			selectionRect.set(undefined);
			break;
		}
		selectionRect.set(rectFromTwoPoints(
			get(presses)[get(presses).length - 1],
			get(moves)[get(moves).length - 1],
		));
		break;
	case "release": {
		const selected = getSelected();
		if (get(keyboard)[16]) { // shift
			execute("addToSelection", vefName[get(elementSelect)], selected);
		} else {
			execute("clearSelection");
			execute("addToSelection", vefName[get(elementSelect)], selected);
		}
		selectionRect.set(undefined);
		presses.set([]);
		moves.set([]);
		releases.set([]);
	}
		break;
	}
};
