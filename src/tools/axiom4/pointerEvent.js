import { get } from "svelte/store";
import { executeCommand } from "../../kernel/execute.js";
import {
	Move,
	Presses,
	Releases,
	InputEdge,
	InputPoint,
	Segment0,
	Segment1,
	Step,
	reset,
} from "./stores.js";

const pointerEvent = (eventType, { point }) => {
	Move.set(eventType === "move" ? point : undefined);
	switch (eventType) {
	case "move": break;
	case "press":
		Presses.update(p => [...p, point]);
		break;
	case "release":
		Releases.update(p => [...p, point]);
		switch (get(Step)) {
		case 2:
			executeCommand("axiom4Rulers", get(InputEdge), get(InputPoint));
			break;
		case 4:
			const segments = [get(Segment0), get(Segment1)]
			reset();
			executeCommand("segment", ...segments);
			break;
		}
	}
};

export default pointerEvent;
