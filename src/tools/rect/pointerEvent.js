import { get } from "svelte/store";
import { executeCommand } from "../../kernel/execute.js";
import {
	Move,
	Press,
	Drag,
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
			executeCommand("rect", start, end);
		}
		reset();
		break;
	}
	if (buttons) { Drag.set(point); }
	else { Move.set(point); }
};

export default pointerEvent;
