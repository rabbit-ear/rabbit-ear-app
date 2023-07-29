import { get } from "svelte/store";
import {
	TOOL_SELECT,
	TOOL_VERTEX,
	TOOL_EDGE,
	TOOL_ASSIGN,
	TOOL_SPLIT_EDGE,
	TOOL_AXIOM_1,
	TOOL_AXIOM_2,
	TOOL_AXIOM_3,
	TOOL_AXIOM_4,
	TOOL_AXIOM_5,
	TOOL_AXIOM_6,
	TOOL_AXIOM_7,
	TOOL_KAWASAKI,
	ASSIGN_SWAP,
	ASSIGN_FLAT,
	ASSIGN_UNASSIGNED,
	ASSIGN_CUT,
	ASSIGN_BOUNDARY,
} from "../app/keys.js";
import {
	Tool,
	AssignType,
} from "../stores/Tool.js";
import { Graph } from "../stores/Graph.js";
import { Selection } from "../stores/Select.js";
import { Keyboard } from "../stores/UI.js";
import {
	Textarea,
	TextareaValue,
} from "../stores/Terminal.js";
import { execute } from "./app.js";
import { Presses, Releases, Moves } from "../stores/UI.js";

const keyboardWindowEventDown = (e) => {
	const { altKey, ctrlKey, metaKey, shiftKey } = e;
	console.log(e.key, e.keyCode, "altKey", altKey, "ctrlKey", ctrlKey, "metaKey", metaKey, "shiftKey", shiftKey);
	// execute functions
	switch (e.keyCode) {
	case 8: // backspace
		e.preventDefault();
		execute("deleteComponents", get(Selection));
		// execute("deleteComponents", {
		// 	vertices: selected.vertices(),
		// 	edges: selected.edges(),
		// 	faces: selected.faces(),
		// });
		break;
	case 27: // ESC
		Presses.set([]);
		Moves.set([]);
		Releases.set([]);
		break;
	case 49: // "1"
		if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
			e.preventDefault();
			Tool.set(TOOL_AXIOM_1);
		}
		break;
	case 50: // "2"
		if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
			e.preventDefault();
			Tool.set(TOOL_AXIOM_2);
		}
		break;
	case 51: // "3"
		if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
			e.preventDefault();
			Tool.set(TOOL_AXIOM_3);
		}
		break;
	case 52: // "4"
		if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
			e.preventDefault();
			Tool.set(TOOL_AXIOM_4);
		}
		break;
	case 53: // "5"
		if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
			e.preventDefault();
			Tool.set(TOOL_AXIOM_5);
		}
		break;
	case 54: // "6"
		if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
			e.preventDefault();
			Tool.set(TOOL_AXIOM_6);
		}
		break;
	case 55: // "7"
		if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
			e.preventDefault();
			Tool.set(TOOL_AXIOM_7);
		}
		break;
	case 65: // "a"
		// select all
		// assignment
		break;
	case 66: // "b"
		// assignment mountain/valley
		if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
			e.preventDefault();
			Tool.set(TOOL_ASSIGN);
			AssignType.set(ASSIGN_BOUNDARY);
		}
		break;
	case 67: // "c"
		// assignment cut
		if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
			e.preventDefault();
			Tool.set(TOOL_ASSIGN);
			AssignType.set(ASSIGN_CUT);
		}
		break;
	case 69: // "e"
		if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
			e.preventDefault();
			Tool.set(TOOL_EDGE);
		}
		break;
	case 70: // "f"
		// assignment flat
		if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
			e.preventDefault();
			Tool.set(TOOL_ASSIGN);
			AssignType.set(ASSIGN_FLAT);
		}
		break;
	case 75: // "k"
		if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
			e.preventDefault();
			Tool.set(TOOL_KAWASAKI);
		}
		break;
	case 77: // "m"
		// assignment mountain/valley
		if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
			e.preventDefault();
			Tool.set(TOOL_ASSIGN);
			AssignType.set(ASSIGN_SWAP);
		}
		break;
	case 78: // "n"
		if (!altKey && (ctrlKey || metaKey) && !shiftKey) {
			e.preventDefault();
			execute("clear");
		}
		break;
	case 83: // "s"
		break;
	case 85: // "u"
		// assignment unassigned
		if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
			e.preventDefault();
			Tool.set(TOOL_ASSIGN);
			AssignType.set(ASSIGN_UNASSIGNED);
		}
		break;
	case 86: // "v"
		// assignment mountain/valley
		if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
			e.preventDefault();
			Tool.set(TOOL_ASSIGN);
			AssignType.set(ASSIGN_SWAP);
		}
		break;
	case 90: // "z"
		if (!altKey && (ctrlKey || metaKey) && !shiftKey) {
			e.preventDefault();
			console.log("undo");
			Graph.revert();
		}
		if (!altKey && (ctrlKey || metaKey) && shiftKey) {
			e.preventDefault();
			console.log("redo");
		}
		break;
	default:
		break;
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
		executeString(get(TextareaValue));
		TextareaValue.set("");
		break;
	default:
		break;
	}
};

export const keyboardEventDown = (e) => {
	// update store state for every key
	Keyboard.update(keys => ({ ...keys, [e.keyCode]: true }));
	// execute different commands based on whether or not
	// the textarea (Terminal) is active.
	if (document.activeElement === get(Textarea)) {
		return keyboardTerminalEventDown(e);
	}
	return keyboardWindowEventDown(e);
};

export const keyboardEventUp = (e) => {
	Keyboard.update(keys => {
		delete keys[e.keyCode];
		return keys;
	});
	// const keys = get(Keyboard);
	// delete keys[e.keyCode];
	// Keyboard.set({ ...keys });
};
