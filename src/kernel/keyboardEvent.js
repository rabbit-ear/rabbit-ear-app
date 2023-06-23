import { get } from "svelte/store";
import {
	TOOL_SELECT,
	TOOL_VERTEX,
	TOOL_EDGE,
	TOOL_SPLIT_EDGE,
} from "../app/keys.js";
import { tool } from "../stores/app.js";
import { selected } from "../stores/select.js";
import { keyboard } from "../stores/ui.js";
import {
	textarea,
	textareaValue,
} from "../stores/terminal.js";
import { execute } from "./app.js";

const keyboardWindowEventDown = (e) => {
	const { altKey, ctrlKey, metaKey, shiftKey } = e;
	console.log(e.key, e.keyCode, "altKey", altKey, "ctrlKey", ctrlKey, "metaKey", metaKey, "shiftKey", shiftKey);
	// execute functions
	switch (e.keyCode) {
	case 8: // backspace
		e.preventDefault();
		execute("deleteComponents", {
			vertices: selected.vertices(),
			edges: selected.edges(),
			faces: selected.faces(),
		});
		break;
	case 65: // "a"
		// select all
		// assignment
		break;
	case 69: // "e"
		// change tool to "edge"
		if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
			e.preventDefault();
			// tool.set(TOOL_EDGE);
		}
		break;
	case 78: // "n"
		if (!altKey && (ctrlKey || metaKey) && !shiftKey) {
			e.preventDefault();
			execute("clear");
		}
		break;
	case 83: // "s"
		// change tool to "select"
		if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
			e.preventDefault();
			tool.set(TOOL_SELECT);
		}
		break;
	case 86: // "v"
		// change tool to "vertex"
		if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
			e.preventDefault();
			tool.set(TOOL_VERTEX);
		}
		break;
	case 90: // "z"
		if (!altKey && (ctrlKey || metaKey) && !shiftKey) {
			e.preventDefault();
			console.log("undo");
		}
		if (!altKey && (ctrlKey || metaKey) && shiftKey) {
			e.preventDefault();
			console.log("redo");
		}
		break;
	default: break;
	}
};

const executeString = (str) => {
	const preParen = str.match(/^[^(]*/);
	const insideParen = str.match(/\(([^\)]+)\)/);
	const fnName = preParen[0];
	const argsStr = (!insideParen || insideParen.length < 2
		? ""
		: insideParen[1]);
	let args;
	try {
		args = JSON.parse(`[${argsStr}]`);
	} catch (error) {
		console.error(error);
		return;
	}
	console.log("insideParen", insideParen);
	console.log("fnName", fnName);
	console.log("argsStr", argsStr);
	console.log("args", args);
	execute(fnName, ...args);
};

const keyboardTerminalEventDown = (e) => {
	switch (e.keyCode) {
	case 13: // return
		if (e.shiftKey) { break; }
		e.preventDefault();
		executeString(get(textareaValue));
		textareaValue.set("");
		break;
	default:
		break;
	}
};

export const keyboardEventDown = (e) => {
	// update store state for every key
	keyboard.set({ ...get(keyboard), [e.keyCode]: true });
	// execute different commands based on whether or not
	// the textarea (Terminal) is active.
	if (document.activeElement === get(textarea)) {
		return keyboardTerminalEventDown(e);
	}
	return keyboardWindowEventDown(e);
};

export const keyboardEventUp = (e) => {
	const keys = get(keyboard);
	delete keys[e.keyCode];
	keyboard.set({ ...keys });
};
