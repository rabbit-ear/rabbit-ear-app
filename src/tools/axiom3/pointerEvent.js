import { get } from "svelte/store";
import { executeCommand } from "../../kernel/execute.js";
import { UILines } from "../../stores/UI.js";
import {
	Move,
	Presses,
	Releases,
	Edge0,
	Edge1,
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
			executeCommand("axiom3Rulers", get(Edge0), get(Edge1));
			UILines.set([]);
			break;
		case 4:
			executeCommand("segment", get(Segment0), get(Segment1));
			reset();
			break;
		}
	}
};

export default pointerEvent;
