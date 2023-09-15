import { get } from "svelte/store";
import execute from "../../kernel/execute.js";
import {
	Move,
	Drag,
	Press,
	PressCoords,
	DragCoords,
	reset,
} from "./stores.js";

const pointerEvent = (eventType, { point, buttons }) => {
	switch (eventType) {
	case "press":
		Press.set(point);
		break;
	case "release":
		const start = get(PressCoords);
		const end = get(DragCoords);
		if (start !== undefined && end !== undefined) {
			execute("segment", start, end);
		}
		reset();
		break;
	default: break;
	}
	if (buttons) { Drag.set(point); }
	else { Move.set(point); }
};

export default pointerEvent;
