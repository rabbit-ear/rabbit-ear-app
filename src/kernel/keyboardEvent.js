import { get } from "svelte/store";
import { keyboardEventEdge } from "./keyboardEventEdge.js";
import { keyboardEventFoldLine } from "./keyboardEventFoldLine.js";
import { keyboardEventDelete } from "./keyboardEventDelete.js";
import { keyboardEventTerminal } from "./keyboardEventTerminal.js";
import { keyboardEventApp } from "./keyboardEventApp.js";
import {
	TOOL_EDGE,
	TOOL_FOLD_LINE,
} from "../app/keys.js";
import {
	Tool,
	AssignType,
} from "../stores/Tool.js";
import {
	DialogNewFile,
	TerminalTextarea,
	ShowTerminal,
} from "../stores/App.js";
import { Keyboard } from "../stores/UI.js";
import { execute } from "./app.js";
import { ResetUI } from "../stores/UI.js";
import { RulerLines, RulerRays } from "../stores/Ruler.js";
import { isFormElementActive } from "../js/dom.js";

const customWindowKeyEvent = (eventType, event) => {
	// custom keyboard events can be determined by
	// the selected tool or the key pressed.
	switch (get(Tool)) {
	case TOOL_EDGE: return keyboardEventEdge(eventType, event);
	case TOOL_FOLD_LINE: return keyboardEventFoldLine(eventType, event);
	default: break;
	}
};

const keyboardWindowEvent = (eventType, event) => {
	if (keyboardEventApp(eventType, event)) { return; }
	// then tool.
	// const tool = get(ToolDefinition);
	// const { keyboardEvent } = tool;
	// if (keyboardEvent) { return keyboardEvent("down", event); }
	customWindowKeyEvent(eventType, event);
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
