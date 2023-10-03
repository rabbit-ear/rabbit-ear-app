import { get } from "svelte/store";
import { CommandHistory } from "../stores/History.js";
import { Modifiers } from "../stores/Modifiers.js";
import { run } from "./shell.js";
/**
 * @description This is the main point of entry to execute
 * a command in the context that contains all the app's functionality.
 * The command will pass through the app's Modifiers, be executed,
 * then print the output to the console.
 * @param {string} js a valid Javascript blob
 */
export const execute = (js) => {
	const commands = [js];
	get(Modifiers).forEach(modifier => modifier.execute(commands));
	// add to the undo stack. clear the redo stack
	const output = commands.flatMap(command => run(command));
	CommandHistory.add(...output);
};
// const stringifyArgs = (...args) => {
// 	const string = args.map(v => JSON.stringify(v)).join(", ");
// 	return string.length > 1000 ? "[LARGE_DATA]" : string;
// }
/**
 * @description This is a more user-friendly alternative to "execute"
 * intended for only one method call, and it can include method arguments.
 * This allows the user to simply type the method name instead of
 * constructing a valid Javascript blob.
 */
export const executeCommand = (name, ...args) => (
	execute(`${name}(${args.map(v => JSON.stringify(v)).join(", ")})`)
);
