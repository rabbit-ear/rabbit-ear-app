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
import { keyboardEventEdge } from "./keyboardEventEdge.js";
import { keyboardEventTerminal } from "./keyboardEventTerminal.js";
import {
	Tool,
	AssignType,
} from "../stores/Tool.js";
// import { Graph } from "../stores/Model.js";
import { Selection } from "../stores/Select.js";
import { Keyboard } from "../stores/UI.js";
import { Textarea } from "../stores/Terminal.js";
import { execute } from "./app.js";
import { Presses, Releases, Moves } from "../stores/UI.js";

const customWindowKeyEvent = (eventType, event) => {
	switch (get(Tool)) {
	case TOOL_EDGE: return keyboardEventEdge(eventType, event);
	default: break;
	}
};

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
	case 16: // Shift
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
			// Graph.revert();
		}
		if (!altKey && (ctrlKey || metaKey) && shiftKey) {
			e.preventDefault();
			console.log("redo");
		}
		break;
	default:
		break;
	}
	return customWindowKeyEvent("down", e);
};

const keyboardWindowEventUp = (event) => (
	customWindowKeyEvent("up", event)
);

const customFormKeyEvent = (eventType, event) => {
	// replace with switch, and an alternative way of
	// getting the current document active element.
	if (document.activeElement === get(Textarea)) {
		return keyboardEventTerminal(eventType, event);
	}
};

const keyboardFormEventDown = (event) => {
	switch (event.keyCode) {
	case 27: // ESC
		console.log("todo: document.body.focus()");
		event.preventDefault();
		document.body.focus();
		console.log("document.activeElement", document.activeElement);
		// return;
		break;
	default: break;
	}
	customFormKeyEvent("down", event)
};

const keyboardFormEventUp = (event) => (
	customFormKeyEvent("up", event)
);

const isFormElementActive = () => {
	const { nodeName } = document.activeElement;
	const name = (nodeName || "").toLowerCase();
	// if these node types are currently active,
	// touches will not be intercepted.
	return name === "textarea"
		|| name === "input";
	// an alternative approach would be to store a reference
	// to every known form element (which requires generating
	// this list), and the compare directly to these references, like:
	// if (document.activeElement === get(Textarea))
}

export const keyboardEventDown = (event) => {
	// update store state for every key
	Keyboard.update(keys => ({ ...keys, [event.keyCode]: true }));
	// execute different commands based on whether or not
	// the textarea (Terminal) is active.
	return isFormElementActive()
		? keyboardFormEventDown(event)
		: keyboardWindowEventDown(event);
};

export const keyboardEventUp = (event) => {
	Keyboard.update(keys => {
		delete keys[event.keyCode];
		return { ...keys };
		// return keys;
	});
	return isFormElementActive()
		? keyboardFormEventUp(event)
		: keyboardWindowEventUp(event);
};
