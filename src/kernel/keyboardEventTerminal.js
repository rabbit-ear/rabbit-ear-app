import { get } from "svelte/store";
import execute from "./execute.js";
import { TerminalValue } from "../stores/App.js";
import { TerminalHistory } from "../stores/History.js";

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
		// console.error(error);
		TerminalHistory.update(history => [
			...history,
			{ html: `<span class="error">${error}</span>` },
		]);
		return;
	}
	// console.log("insideParen", insideParen);
	// console.log("fnName", fnName);
	// console.log("argsStr", argsStr);
	// console.log("args", args);
	execute(fnName, ...args);
};

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
