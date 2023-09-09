import { TerminalHistory } from "../stores/History.js";
import * as UICommands from "./uiCommands/index.js";
import { ExecuteUIInput } from "../stores/Debug.js";
/**
 * @description the main execution method. all methods, from UI to
 * graph-modifying should pass through this method. pre and post-
 * execute event methods can be called, and the effect of calling
 * a method here will print it to the history log in the terminal.
 */
const executeUI = (funcName, ...args) => {
	ExecuteUIInput.set(funcName + "\n" + JSON.stringify(args));
	const func = UICommands[funcName];
	if (!func) {
		const error = new Error(`no known function with the name "${funcName}"`);
		TerminalHistory.update(history => [
			...history,
			{ html: `<span class="error">${error}</span>` },
		]);
		return;
	}
	let result;
	try {
		result = func(...args);
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
