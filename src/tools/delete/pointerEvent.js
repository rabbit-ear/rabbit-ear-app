import { get } from "svelte/store";
import { executeCommand } from "../../kernel/execute.js";
import {
	Move,
	Edge,
} from "./stores.js";

const pointerEvent = (eventType, { point }) => {
	if (eventType === "press") {
		const edge = get(Edge);
		if (edge !== undefined) {
			executeCommand("deleteComponents", { edges: [edge] });
		}
	}
	Move.set(point);
};

export default pointerEvent;
