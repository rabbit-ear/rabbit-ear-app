import { get } from "svelte/store";
import { nearest } from "rabbit-ear/graph/nearest.js";
import { SelectionRect } from "./stores.js";
import { Graph } from "../../stores/Model.js";
import { Keyboard } from "../../stores/UI.js";
import { getSelected } from "../../js/select.js";
import execute from "../../kernel/execute.js";
import { ElementSelect } from "../../stores/UI.js";
import { SelectHoverIndex } from "./stores.js";
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
const pointerEventSelect = (eventType, { point }) => {
	switch (eventType) {
	case "hover":
		const near = nearest(get(Graph), point);
		SelectHoverIndex.set({
			vertex: near.vertex,
			edge: near.edge,
			face: near.face,
		})
		break;
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
			execute("addToSelection", get(ElementSelect), selected);
		} else {
			execute("clearSelection");
			execute("addToSelection", get(ElementSelect), selected);
		}
		SelectionRect.set(undefined);
		break;
	}
};

export default pointerEventSelect;
