import {
	get,
	derived,
	readable,
} from "svelte/store";
import { isFormElementActive } from "../js/dom.js";
import { execute } from "../kernel/execute.js";
import {
	TerminalTextarea,
	TerminalValue,
} from "../stores/App.js";
import {
	Tool,
	Keyboard,
} from "../stores/UI.js";
import {
	ReplayCommand,
	ReplayCommandIndex,
} from "../stores/History.js";
import Keybindings from "./Keybindings.js";
/**
 * 
 */
export const AppKeyboardEvent = readable((eventType, event) => {
	const { altKey, ctrlKey, metaKey, shiftKey } = event;
	const modifier = (shiftKey << 0) | ((ctrlKey || metaKey) << 1) | (altKey << 2);
	const boundFunction = Keybindings[eventType][event.keyCode]
		? Keybindings[eventType][event.keyCode][modifier]
		: undefined;
	if (!boundFunction) { return false; }
	event.preventDefault();
	boundFunction(event);
	return true;
});
/**
 * 
 */
const ToolKeyboardEvent = derived(
	Tool,
	($Tool) => $Tool && $Tool.keyboardEvent
		? $Tool.keyboardEvent
		: () => {},
	() => {},
);
/**
 * todo: i think this needs to be refactored. writable(). not a derived.
 * it's probably reloading a new function every single state update.
 */
const FormKeyboardEvent = derived(
	[TerminalTextarea, TerminalValue],
	([$TerminalTextarea, $TerminalValue]) => (eventType, event) => {
		// console.log("FormKeyboardEvent");
		if (eventType === "down" && document.activeElement === $TerminalTextarea) {
			switch (event.keyCode) {
			case 13: // return key
				if (!event.shiftKey) {
					event.preventDefault();
					execute($TerminalValue);
					TerminalValue.set("");
				}
				break;
			case 38: // up arrow key
				ReplayCommandIndex.decrement();
				TerminalValue.set(get(ReplayCommand).text);
				break;
			case 40: // down arrow key
				ReplayCommandIndex.increment();
				TerminalValue.set(get(ReplayCommand).text);
				break;
			default: break;
			}
		}
		// else {
		// 	switch (event.keyCode) {
		// 	case 67:
		// 		if (event.metaKey || event.ctrlKey) {
		// 			console.log("FormKeyboardEvent CMD + C");
		// 		}
		// 		break;
		// 	case 86:
		// 		if (event.metaKey || event.ctrlKey) {
		// 			console.log("FormKeyboardEvent CMD + V");
		// 		}
		// 		break;
		// 	}
		// }
		return false;
	},
	() => {},
);
/**
 * 
 */
const WindowKeyboardEvent = derived(
	[AppKeyboardEvent, ToolKeyboardEvent],
	([$AppKeyboardEvent, $ToolKeyboardEvent]) => (eventType, event) => {
		if ($AppKeyboardEvent(eventType, event)) { return; }
		if ($ToolKeyboardEvent(eventType, event)) { return; }
	},
	() => {},
);
/**
 * 0.61812
 */
export const KeyboardEvent = derived(
	[FormKeyboardEvent, WindowKeyboardEvent],
	([$FormKeyboardEvent, $WindowKeyboardEvent]) => (eventType, event) => {
		switch (eventType) {
		case "down":
			Keyboard.update(keys => ({ ...keys, [event.keyCode]: true }));
			break;
		case "up":
			Keyboard.update(keys => {
				delete keys[event.keyCode];
				// return { ...keys };
				return keys;
			});
			break;
		}
		return isFormElementActive()
			? $FormKeyboardEvent(eventType, event)
			: $WindowKeyboardEvent(eventType, event);
	},
	() => {},
);
