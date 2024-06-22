// click on a face, but also click on a point, if they drag to another point, that shared edge between the points will contain the perpendicular opposing crease.
import { Move, Drag, Press, Release, reset } from "./stores.js";
import { executeCommand } from "../../kernel/execute.js";

const pointerEvent = (eventType, { point, buttons }) => {
	switch (eventType) {
		case "press":
			Press.set(point);
			break;
		case "release":
			Release.set(point);
			// executeCommand("rabbitEar");
			reset();
			break;
	}
	if (buttons) {
		Drag.set(point);
	} else {
		Move.set(point);
	}
};

export default pointerEvent;
