import { get } from "svelte/store";
import { TerminalHistory } from "../stores/History.js";
import { Modifiers } from "../stores/Modifiers.js";
import { run, runSilent } from "./shell.js";
import Commands from "./commands/index.js";
/**
 *
 */
export const execute = (string) => {
	const commands = [string];
	get(Modifiers).forEach(modifier => modifier(commands));
	const output = commands.flatMap(command => run(command));
	TerminalHistory.update(history => [...history, ...output]);
};

const stringifyCall = (name, ...args) => (
	`${name}(${args.map(v => JSON.stringify(v)).join(", ")})`
);
/**
 * @description the main execution method. all methods, from UI to
 * graph-modifying should pass through this method. pre and post-
 * execute event methods can be called, and the effect of calling
 * a method here will print it to the history log in the terminal.
 */
export const executeCommand = (name, ...args) => (
	execute(stringifyCall(name, ...args))
);
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
	TerminalHistory.update(history => [...history, ...output]);
};

export const executeSilentCommand = (name, ...args) => (
	executeSilent(stringifyCall(name, ...args))
);
