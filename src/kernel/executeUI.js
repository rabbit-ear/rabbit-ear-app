import { TerminalHistory } from "../stores/History.js";
import * as UICommands from "./uiCommands/index.js";
import { ExecuteUIInput } from "../stores/Debug.js";
/**
 * @description the main execution method. all methods, from UI to
 * graph-modifying should pass through this method. pre and post-
 * execute event methods can be called, and the effect of calling
 * a method here will print it to the history log in the terminal.
 */
const executeUI = (name, ...args) => {
	ExecuteUIInput.set(name + "\n" + JSON.stringify(args));
	const fn = UICommands[name];
	if (!fn) {
		const error = new Error(`no known function with the name "${name}"`);
		TerminalHistory.update(history => [
			...history,
			{ html: `<span class="error">${error}</span>` },
		]);
		return;
	}
	let result;
	try {
		result = fn(...args);
	} catch (error) {
		// ui requests will silently fail
		// console.error(error);
		return;
	}
	// if command returned anything, print output to terminal
	if (result !== undefined) {
		newHistory.push({ html: formatCommandResult(result) });
	}
};

export default executeUI;
