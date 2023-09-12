import { get } from "svelte/store";
import execute from "../../kernel/execute.js";
import {
	reset,
	Move,
	Drag,
	Press,
	PressCoords,
	DragCoords,
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
			execute("addEdge", start, end);
		}
		reset();
		break;
	default: break;
	}
	if (buttons) { Drag.set(point); }
	else { Move.set(point); }
};

export default pointerEvent;
