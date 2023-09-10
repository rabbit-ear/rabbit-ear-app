import {
	derived,
	readable,
} from "svelte/store";
import { isFormElementActive } from "../js/dom.js";
import executeTerminal from "../kernel/executeTerminal.js";
import {
	TerminalTextarea,
	TerminalValue,
} from "../stores/App.js";
import {
	Tool,
	Keyboard,
} from "../stores/UI.js";
import {
	KeybindingsDown,
	KeybindingsUp,
} from "./Keybindings.js";

// if KeybindingsDown/Up ever change to become stores
// this needs to be refactored.
const Keybindings = {
	up: KeybindingsUp,
	down: KeybindingsDown,
};

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

const ToolKeyboardEvent = derived(
	Tool,
	($Tool) => $Tool && $Tool.keyboardEvent
		? $Tool.keyboardEvent
		: () => {},
	() => {},
);

const FormKeyboardEvent = derived(
	[TerminalTextarea, TerminalValue],
	([$TerminalTextarea, $TerminalValue]) => (eventType, event) => {
		if (document.activeElement === $TerminalTextarea
			&& event.keyCode === 13 // return key
			&& !event.shiftKey
			&& eventType === "down") {
			event.preventDefault();
			executeTerminal($TerminalValue);
			TerminalValue.set("");
		}
	},
	() => {},
);

const WindowKeyboardEvent = derived(
	[AppKeyboardEvent, ToolKeyboardEvent],
	([$AppKeyboardEvent, $ToolKeyboardEvent]) => (eventType, event) => {
		if ($AppKeyboardEvent(eventType, event)) { return; }
		if ($ToolKeyboardEvent(eventType, event)) { return; }
	},
	() => {},
);

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
