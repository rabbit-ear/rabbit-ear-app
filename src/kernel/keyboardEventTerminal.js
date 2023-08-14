import { get } from "svelte/store";
import { TerminalValue } from "../stores/App.js";
import { executeString } from "./app.js";

export const keyboardEventTerminal = (eventType, event) => {
	if (event.keyCode === 13) { // Return
		switch (eventType) {
		case "up":
			break;
		case "down":
			if (event.shiftKey) { break; }
			event.preventDefault();
			// if command is a valid operation, cache the FileHistory
			executeString(get(TerminalValue));
			TerminalValue.set("");
			break;
		}
	}
};
