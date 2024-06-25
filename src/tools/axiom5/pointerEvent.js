import { get } from "svelte/store";
import { executeCommand } from "../../kernel/execute.js";
import {
	Move,
	Presses,
	Releases,
	InputEdge,
	InputPoint0,
	InputPoint1,
	Segment0,
	Segment1,
	Step,
	reset,
} from "./stores.js";

const pointerEvent = (eventType, { point }) => {
	Move.set(eventType === "move" ? point : undefined);
	switch (eventType) {
		case "move":
			break;
		case "press":
			Presses.update((p) => [...p, point]);
			break;
		case "release":
			Releases.update((p) => [...p, point]);
			switch (get(Step)) {
				case 4:
					executeCommand(
						"axiom5Rulers",
						get(InputEdge),
						get(InputPoint0),
						get(InputPoint1),
					);
					break;
				case 6:
					executeCommand("segment", [get(Segment0), get(Segment1)]);
					reset();
					break;
			}
	}
};

export default pointerEvent;
