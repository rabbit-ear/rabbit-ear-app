import { get } from "svelte/store";
import execute from "../../kernel/execute.js";
import {
	Move,
	Drag,
	Press,
	PressVertex,
	DragVector,
} from "./stores.js";

const pointerEvent = (eventType, { point, buttons }) => {
	switch (eventType) {
	case "press":
		Press.set(point);
		break;
	case "release":
		const vertex = get(PressVertex);
		if (vertex !== undefined) {
			execute("translateVertices", [vertex], get(DragVector));
		}
		Press.set(undefined);
		break;
	default: break;
	}
	if (buttons) { Drag.set(point); }
	else { Move.set(point); }
};

export default pointerEvent;
