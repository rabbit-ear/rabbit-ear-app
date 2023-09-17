import { get } from "svelte/store";
import {
	Move,
	Drag,
	Press,
	Release,
	SelectionRect,
	ElementSelect,
	reset,
	vefName,
} from "./stores.js";
import { Graph } from "../../stores/Model.js";
import {
	Keyboard,
	UIEpsilon,
} from "../../stores/UI.js";
import { executeCommand } from "../../kernel/execute.js";
import {
	getComponentsNearPoint,
	getComponentsInsideRect,
} from "../../js/select.js";

/**
 * @description get the selected components inside the SelectionRect
 */
export const getSelected = () => {
	const rect = get(SelectionRect);
	if (rect === undefined) { return {}; }
	const uiEpsilon = get(UIEpsilon);
	const nears = Math.max(...rect.span) < uiEpsilon
		? getComponentsNearPoint(get(Graph), rect.min)
		: getComponentsInsideRect(get(Graph), rect);
	return nears[vefName[get(ElementSelect)]];
};

const pointerEvent = (eventType, { point, buttons }) => {
	switch (eventType) {
	case "press":
		Press.set(point);
		break;
	case "release":
		Release.set(point);
		// if shift key is not pressed, clear selection.
		if (!get(Keyboard)[16]) { executeCommand("deselectAll"); }
		executeCommand("addToSelection", get(ElementSelect), getSelected());
		reset();
		break;
	}
	if (buttons) { Drag.set(point); }
	else { Move.set(point); }
};

export default pointerEvent;
