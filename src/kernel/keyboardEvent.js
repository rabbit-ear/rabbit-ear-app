import { get } from "svelte/store";
import { isFormElementActive } from "../js/dom.js";
import { TerminalTextarea } from "../stores/App.js";
import {
	Keyboard,
	Tool,
} from "../stores/UI.js";
import { keyboardEventApp } from "./keyboardEventApp.js";
import { keyboardEventTerminal } from "./keyboardEventTerminal.js";

const keyboardWindowEvent = (eventType, event) => {
	if (keyboardEventApp(eventType, event)) { return; }
	// custom keyboard events can be determined by
	// the selected tool or the key pressed.
	const tool = get(Tool);
	if (tool.keyboardEvent) {
		return tool.keyboardEvent(eventType, event);
	}
};

const keyboardFormEvent = (eventType, event) => {
	switch (eventType) {
	case "down":
		if (document.activeElement === get(TerminalTextarea)) {
			return keyboardEventTerminal(eventType, event);
		}
		break;
	case "up":
		break;
	}
};

export const keyboardEventDown = (event) => {
	// update store state for every key
	Keyboard.update(keys => ({ ...keys, [event.keyCode]: true }));
	// execute different commands based on whether or not
	// the input is on a form element
	return isFormElementActive()
		? keyboardFormEvent("down", event)
		: keyboardWindowEvent("down", event);
};

export const keyboardEventUp = (event) => {
	// update store state for every key
	Keyboard.update(keys => {
		delete keys[event.keyCode];
		// return { ...keys };
		return keys;
	});
	// execute different commands based on whether or not
	// the input is on a form element
	return isFormElementActive()
		? keyboardFormEvent("up", event)
		: keyboardWindowEvent("up", event);
};
