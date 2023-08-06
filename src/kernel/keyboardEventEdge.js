import { get } from "svelte/store";
import { Presses } from "../stores/UI.js";
import { RulerLines } from "../stores/Ruler.js";
import { execute } from "./app.js";

export const keyboardEventEdge = (eventType, event) => {
	if (event.keyCode === 16) {
		switch (eventType) {
		case "down":
			const presses = get(Presses);
			if (presses.length) {
				execute("radialRulers", presses[0]);
			}
			break;
		case "up":
			RulerLines.set([]);
			break;
		}
	}
};
