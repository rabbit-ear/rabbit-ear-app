import { get } from "svelte/store";
import { TerminalHistory } from "../stores/History.js";
import { Modifiers } from "../stores/Modifiers.js";
import { FileHistory } from "../stores/History.js";
import { runCommand } from "./shell.js";
/**
 *
 */
const doNotSaveHistory = {
	download: true,
	kawasakiRulers: true,
}
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
const execute = (name, ...args) => {
	FileHistory.cache();
	console.log("execute", stringifyCall(name, ...args));
	const commands = [{ name, args }];
	get(Modifiers).forEach(modifier => modifier(commands));
	const output = commands
		.flatMap(command => runCommand(command.name, ...command.args));
	TerminalHistory.update(history => [...history, ...output]);
};

export default execute;
