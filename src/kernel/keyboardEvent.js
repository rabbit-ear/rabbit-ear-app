import { get } from "svelte/store";
import {
	TOOL_EDGE,
	TOOL_FOLD_LINE,
} from "../app/keys.js";
import { isFormElementActive } from "../js/dom.js";
import {
	ToolNew,
	AssignType,
} from "../stores/Tool.js";
import {
	DialogNewFile,
	TerminalTextarea,
	ShowTerminal,
} from "../stores/App.js";
import { Keyboard } from "../stores/UI.js";
import { ResetUI } from "../stores/UI.js";
import { RulerLines, RulerRays } from "../stores/Ruler.js";
import { keyboardEventApp } from "./keyboardEventApp.js";
// import { keyboardEventEdge } from "./keyboardEventEdge.js";
// import { keyboardEventFoldLine } from "./keyboardEventFoldLine.js";
// import { keyboardEventTerminal } from "./keyboardEventTerminal.js";
import execute from "./execute.js";

const customWindowKeyEvent = (eventType, event) => {
	// custom keyboard events can be determined by
	// the selected tool or the key pressed.
	const tool = get(ToolNew);
	if (tool.keyboardEvent) {
		return tool.keyboardEvent(eventType, event);
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
