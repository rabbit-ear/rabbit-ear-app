import { get, writable } from "svelte/store";
import { TerminalHistory } from "../stores/History.js";
import { ExecuteInput } from "../stores/Debug.js";
import {
	formatCommandResult,
	formatCommandCall,
} from "./format.js";
import Commands from "./commands/index.js";
/**
 * @description pre and post execute event function parameters should
 * be in the form of (funcName: string, ...args: any[])
 * the funcName being the name of the function which was just executed.
 */
export const preExecuteEvents = writable([]);
export const postExecuteEvents = writable([]);
/**
 * @description "preview" functions do not run the pre and post events
 * because they simply generate UI Previews. in fact, I kind of feel
 * like they shouldn't even be running through the kernel to begin with.
 */
const noHistoryCommands = {
	"axiom1Preview": true,
	"axiom2Preview": true,
	"axiom3Preview": true,
	"axiom4Preview": true,
	"axiom5Preview": true,
	"axiom6Preview": true,
	"axiom7Preview": true,
	"kawasakiRulerPreviews": true,
	"repeatFoldLinePreview": true,
	// "autoPlanarize": true,
};
/**
 * @description the main execution method. all methods, from UI to
 * graph-modifying should pass through this method. pre and post-
 * execute event methods can be called, and the effect of calling
 * a method here will print it to the history log in the terminal.
 */
const execute = (funcName, ...args) => {
	ExecuteInput.set(funcName + "\n" + JSON.stringify(args));
	const func = Commands[funcName];
	if (!func) {
		const error = new Error(`no known function with the name "${funcName}"`);
		TerminalHistory.update(history => [
			...history,
			{ html: `<span class="error">${error}</span>` },
		]);
		return;
	}
	if (noHistoryCommands[funcName]) {
		func(...args);
		return;
	}
	let res;
	const preEvents = get(preExecuteEvents);
	const postEvents = get(postExecuteEvents);
	try {
		preEvents.forEach(fn => fn(funcName, ...args));
		res = func(...args);
		postEvents.forEach(fn => fn(funcName, ...args));
	} catch (error) {
		// console.error(error);
		TerminalHistory.update(history => [
			...history,
			{ html: `<span class="error">${error}</span>` },
		]);
		return;
	}
	const newHistory = [];
	try {
		newHistory.push({ html: formatCommandCall(func.name, args) });
	} catch (error) {
		newHistory.push({ html: error });
		return;
	}
	// if command returned anything, print output to terminal
	if (res !== undefined) {
		newHistory.push({ html: formatCommandResult(res) });
	}
	TerminalHistory.update(history => [...history, ...newHistory]);
	return res;
};

export default execute;
