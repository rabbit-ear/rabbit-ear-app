import { get } from "svelte/store";
import { TextareaValue } from "../stores/Terminal.js";
import { executeString } from "./app.js";

export const keyboardEventTerminal = (eventType, event) => {
	if (event.keyCode === 13) { // Return
		switch (eventType) {
		case "up":
			break;
		case "down":
			if (event.shiftKey) { break; }
			event.preventDefault();
			executeString(get(TextareaValue));
			TextareaValue.set("");
			break;
		}
	}
};
