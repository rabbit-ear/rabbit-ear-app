import { get } from "svelte/store";
import { Data } from "./stores.js";
import {
	RadialSnapDegrees,
	RadialSnapOffset,
} from "../../stores/Snap.js";
import {
	RulerLines,
	RulerRays,
	} from "../../stores/Ruler.js";
import execute from "../../kernel/execute.js";

const keyboardEventEdge = (eventType, event) => {
	if (event.keyCode === 16) {
		switch (eventType) {
		case "down":
			if (Data.pressCoords) {
				execute("radialRulers",
					Data.pressCoords,
					get(RadialSnapDegrees),
					get(RadialSnapOffset),
				);
			}
			break;
		case "up":
			RulerLines.set([]);
			RulerRays.set([]);
			break;
		}
	}
};

export default keyboardEventEdge;
