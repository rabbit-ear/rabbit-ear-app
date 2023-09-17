import { get } from "svelte/store";
import { executeCommand } from "../../kernel/execute.js";
import {
	Move,
	Presses,
	Releases,
	Coords0,
	Coords1,
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
			executeCommand("axiom2Rulers", get(Coords0), get(Coords1));
			break;
		case 4:
			executeCommand("segment", get(Segment0), get(Segment1));
			reset();
			break;
		}
	}
};

export default pointerEvent;
