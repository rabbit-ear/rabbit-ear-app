import { get } from "svelte/store";
import { TerminalHistory } from "../stores/History.js";
import { ExecuteInput } from "../stores/Debug.js";
import { Modifiers } from "../stores/Modifiers.js";
import run from "./run.js";
/**
 * @description the main execution method. all methods, from UI to
 * graph-modifying should pass through this method. pre and post-
 * execute event methods can be called, and the effect of calling
 * a method here will print it to the history log in the terminal.
 */
const execute = (name, ...args) => {
	const commands = [{ name, args }];
	get(Modifiers).forEach(modifier => modifier(commands));
	const output = commands
		.flatMap(command => run(command.name, ...command.args));
	TerminalHistory.update(history => [...history, ...output]);
};

// const execute = (name, ...args) => {
// 	// ExecuteInput.set(name + "\n" + JSON.stringify(args));
// 	const func = Commands[name];
// 	if (!func) {
// 		const error = new Error(`no known function with the name "${name}"`);
// 		TerminalHistory.update(history => [
// 			...history,
// 			{ html: `<span class="error">${error}</span>` },
// 		]);
// 		return;
// 	}
// 	if (noHistoryCommands[name]) {
// 		func(...args);
// 		return;
// 	}
// 	let res;
// 	const preEvents = get(preExecuteEvents);
// 	const postEvents = get(postExecuteEvents);
// 	try {
// 		preEvents.forEach(fn => fn(name, ...args));
// 		res = func(...args);
// 		postEvents.forEach(fn => fn(name, ...args));
// 	} catch (error) {
// 		// console.error(error);
// 		TerminalHistory.update(history => [
// 			...history,
// 			{ html: `<span class="error">${error}</span>` },
// 		]);
// 		return;
// 	}
// 	const newHistory = [];
// 	try {
// 		newHistory.push({ html: formatCommandCall(func.name, args) });
// 	} catch (error) {
// 		newHistory.push({ html: error });
// 		return;
// 	}
// 	// if command returned anything, print output to terminal
// 	if (res !== undefined) {
// 		newHistory.push({ html: formatCommandResult(res) });
// 	}
// 	TerminalHistory.update(history => [...history, ...newHistory]);
// 	return res;
// };

export default execute;
