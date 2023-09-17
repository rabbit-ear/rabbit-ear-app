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
 *
 */
export const execute = (string) => {
	const commands = [string];
	get(Modifiers).forEach(modifier => modifier(commands));
	const output = commands.flatMap(command => run(command));
	CommandHistory.update(history => [...history, ...output]);
};
/**
 * @description the main execution method. all methods, from UI to
 * graph-modifying should pass through this method. pre and post-
 * execute event methods can be called, and the effect of calling
 * a method here will print it to the history log in the terminal.
 */
export const executeSilent = (string) => {
	const commands = [string];
	get(Modifiers).forEach(modifier => modifier(commands));
	const output = commands.flatMap(command => runSilent(command));
	CommandHistory.update(history => [...history, ...output]);
};
/**
 *
 */
const stringifyCall = (name, ...args) => (
	`${name}(${args.map(v => JSON.stringify(v)).join(", ")})`
);
/**
 * @description the main execution method. all methods, from UI to
 * graph-modifying should pass through this method. pre and post-
 * execute event methods can be called, and the effect of calling
 * a method here will print it to the history log in the terminal.
 */
export const executeCommand = (name, ...args) => (silentMethods[name]
	? executeSilent(stringifyCall(name, ...args))
	: execute(stringifyCall(name, ...args))
);
