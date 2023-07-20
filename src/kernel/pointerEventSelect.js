import { get } from "svelte/store";
import { ElementSelect } from "../stores/Tool.js";
import { SelectionRect } from "../stores/Select.js";
import { Keyboard } from "../stores/UI.js";
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

let press;
/**
 *
 */
export const pointerEventSelect = (eventType, { point }) => {
	switch (eventType) {
	case "press":
		press = point;
		SelectionRect.set(undefined);
		break;
	case "move":
		if (press === undefined) {
			SelectionRect.set(undefined);
			break;
		}
		SelectionRect.set(rectFromTwoPoints(press, point));
		break;
	case "release":
		const selected = getSelected();
		if (get(Keyboard)[16]) { // shift
			execute("addToSelection", vefName[get(ElementSelect)], selected);
		} else {
			execute("clearSelection");
			execute("addToSelection", vefName[get(ElementSelect)], selected);
		}
		SelectionRect.set(undefined);
		break;
	}
};
