import { get } from "svelte/store";
import { CommandHistory } from "../stores/History.js";
import { Modifiers } from "../stores/Modifiers.js";
import Commands from "./commands/index.js";
import { silentMethods } from "./settings.js";
import {
	run,
	runSilent,
} from "./shell.js";
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
/**
 * @description UI methods will be redirected through here to avoid
 * being printed out to the console.
 */
const executeSilent = (js) => {
	const commands = [js];
	get(Modifiers).forEach(modifier => modifier.execute(commands));
	const output = commands.flatMap(command => runSilent(command));
	CommandHistory.add(...output);
};
/**
 * @description Convert a method name and its parameters into
 * a stringified valid Javascript code blob.
 */
const stringifyCall = (name, ...args) => (
	`${name}(${args.map(v => JSON.stringify(v)).join(", ")})`
);
/**
 * @description This is a more user-friendly alternative to "execute"
 * intended for only one method call, and it can include method arguments.
 * This allows the user to simply type the method name instead of
 * constructing a valid Javascript blob.
 */
export const executeCommand = (name, ...args) => (silentMethods[name]
	? executeSilent(stringifyCall(name, ...args))
	: execute(stringifyCall(name, ...args))
);
