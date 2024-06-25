import { RulersCP, RulersFolded } from "../../stores/Ruler.js";
import { RulerSetRequest } from "./stores.js";

export const keyboardEvent = (eventType, e) => {
	switch (eventType) {
		case "up":
			if (e.keyCode === 16) {
				RulersCP.set([]);
				RulersFolded.set([]);
			}
			break;
		case "down":
			RulerSetRequest.set(true);
			break;
	}
};
