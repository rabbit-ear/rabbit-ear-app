import { get } from "svelte/store";
import {
	TOOL_SELECT,
	TOOL_VERTEX,
	TOOL_EDGE,
	TOOL_DELETE,
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
	TOOL_TRANSLATE,
	ASSIGN_SWAP,
	ASSIGN_FLAT,
	ASSIGN_UNASSIGNED,
	ASSIGN_CUT,
	ASSIGN_BOUNDARY,
} from "../app/keys.js";
import { keyboardEventEdge } from "./keyboardEventEdge.js";
import { keyboardEventDelete } from "./keyboardEventDelete.js";
import { keyboardEventTerminal } from "./keyboardEventTerminal.js";
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

const customWindowKeyEvent = (eventType, event) => {
	// custom keyboard events can be determined by
	// the selected tool or the key pressed.
	switch (get(Tool)) {
	case TOOL_EDGE: return keyboardEventEdge(eventType, event);
	default: break;
	}
	switch (event.keyCode) {
	case 8: return keyboardEventDelete(eventType, event);
	}
};

const keyboardWindowEventDown = (event) => {
	const { altKey, ctrlKey, metaKey, shiftKey } = event;
	// console.log(event.key, event.keyCode, "altKey", altKey, "ctrlKey", ctrlKey, "metaKey", metaKey, "shiftKey", shiftKey);
	// execute functions
	switch (event.keyCode) {
	case 8: // delete
		// currently selected a frame from the frame item panel.
		// user would like to delete this frame.
		if (document.activeElement
			&& document.activeElement.classList
			&& document.activeElement.classList.contains("button-frame-item")) {
			execute("deleteActiveFrame");
		}
		break;
	case 16: // Shift
		break;
	case 27: // ESC
		ResetUI();
		RulerLines.set([]);
		RulerRays.set([]);
		// todo: a bit overkill here. can this action be bound
		// to the dialog, so it only fires when it's active?
		// update: turns out this is a default behavior built in.
		// get(DialogNewFile).close();
		break;
	case 49: // "1"
		if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
			event.preventDefault();
			Tool.set(TOOL_AXIOM_1);
		}
		break;
	case 50: // "2"
		if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
			event.preventDefault();
			Tool.set(TOOL_AXIOM_2);
		}
		break;
	case 51: // "3"
		if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
			event.preventDefault();
			Tool.set(TOOL_AXIOM_3);
		}
		break;
	case 52: // "4"
		if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
			event.preventDefault();
			Tool.set(TOOL_AXIOM_4);
		}
		break;
	case 53: // "5"
		if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
			event.preventDefault();
			Tool.set(TOOL_AXIOM_5);
		}
		break;
	case 54: // "6"
		if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
			event.preventDefault();
			Tool.set(TOOL_AXIOM_6);
		}
		break;
	case 55: // "7"
		if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
			event.preventDefault();
			Tool.set(TOOL_AXIOM_7);
		}
		break;
	case 65: // "a"
		if (!altKey && (ctrlKey || metaKey) && !shiftKey) {
			event.preventDefault();
			execute("selectAll");
		}
		break;
	case 66: // "b"
		// assignment mountain/valley
		if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
			event.preventDefault();
			Tool.set(TOOL_ASSIGN);
			AssignType.set(ASSIGN_BOUNDARY);
		}
		break;
	case 67: // "c"
		// assignment cut
		if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
			event.preventDefault();
			Tool.set(TOOL_ASSIGN);
			AssignType.set(ASSIGN_CUT);
		}
		break;
	case 68: // "d"
		if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
			event.preventDefault();
			Tool.set(TOOL_DELETE);
		}
		break;
	case 69: // "e"
		if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
			event.preventDefault();
			Tool.set(TOOL_EDGE);
		}
		break;
	case 70: // "f"
		if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
			event.preventDefault();
			Tool.set(TOOL_ASSIGN);
			AssignType.set(ASSIGN_FLAT);
		}
		break;
	case 75: // "k"
		if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
			event.preventDefault();
			Tool.set(TOOL_KAWASAKI);
		}
		break;
	case 77: // "m"
		if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
			event.preventDefault();
			Tool.set(TOOL_ASSIGN);
			AssignType.set(ASSIGN_SWAP);
		}
		break;
	case 78: // "n"
		if (!altKey && (ctrlKey || metaKey) && !shiftKey) {
			event.preventDefault();
			get(DialogNewFile).showModal();
		}
		break;
	case 83: // "s"
		if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
			event.preventDefault();
			Tool.set(TOOL_SELECT);
		}
		break;
	case 84: // "t"
		if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
			event.preventDefault();
			Tool.set(TOOL_TRANSLATE);
		}
		break;
	case 85: // "u"
		if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
			event.preventDefault();
			Tool.set(TOOL_ASSIGN);
			AssignType.set(ASSIGN_UNASSIGNED);
		}
		break;
	case 86: // "v"
		if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
			event.preventDefault();
			Tool.set(TOOL_ASSIGN);
			AssignType.set(ASSIGN_SWAP);
		}
		break;
	case 90: // "z"
		if (!altKey && (ctrlKey || metaKey) && !shiftKey) {
			event.preventDefault();
			execute("undo");
		}
		if (!altKey && (ctrlKey || metaKey) && shiftKey) {
			event.preventDefault();
			console.log("redo");
		}
		break;
	case 191: // / (forward slash)
		if (!get(ShowTerminal)) {
			ShowTerminal.set(true);
		} else {
			get(TerminalTextarea).focus();
		}
		event.preventDefault();
		break;
	default:
		break;
	}
	return customWindowKeyEvent("down", event);
};

const keyboardWindowEventUp = (event) => (
	customWindowKeyEvent("up", event)
);

const customFormKeyEvent = (eventType, event) => {
	// replace with switch, and an alternative way of
	// getting the current document active element.
	if (document.activeElement === get(TerminalTextarea)) {
		return keyboardEventTerminal(eventType, event);
	}
};

const keyboardFormEventDown = (event) => {
	switch (event.keyCode) {
	case 27: // ESC
		console.log("todo: document.body.focus()");
		event.preventDefault();
		get(TerminalTextarea).focus();
		// document.body.focus();
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

// form element that take in text input (type=text, number, etc..)
// form elements like radio do not count,
// keyboard event should bubble through.
const isFormElementActive = () => {
	const node = document.activeElement;
	if (!node) { return false; }
	const name = (node.nodeName || "").toLowerCase();
	const type = (node.type || "").toLowerCase();
	// if these node types are currently active,
	// touches will not be intercepted.
	switch (name) {
	case "textarea": return true;
	case "input":
		switch (type) {
		case "date": 
		case "datetime-local": 
		case "month": 
		case "number": 
		case "password": 
		case "tel": 
		case "time": 
		case "email": 
		case "text": return true;
		case "button": 
		case "checkbox": 
		case "color": 
		case "file": 
		case "hidden": 
		case "image": 
		case "radio": 
		case "range": 
		case "reset": 
		case "search": 
		case "submit": 
		case "url": 
		case "week":
		default:
		return false;
		}
	}
	// an alternative approach would be to store a reference
	// to every known form element (which requires generating
	// this list), and the compare directly to these references, like:
	// if (document.activeElement === get(TerminalTextarea))
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
