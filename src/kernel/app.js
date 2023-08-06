import { get, writable } from "svelte/store";
import { TerminalHistory } from "../stores/History.js";
import * as Functions from "./functions.js";
/**
 * @description pre and post execute event function parameters should
 * be in the form of (funcName: string, ...args: any[])
 * the funcName being the name of the function which was just executed.
 */
export const preExecuteEvents = writable([]);
export const postExecuteEvents = writable([]);
/**
 *
 */
const previewFunctions = {
	"axiom1Preview": true,
	"axiom2Preview": true,
	"axiom3Preview": true,
	"axiom4Preview": true,
	"axiom5Preview": true,
	"axiom6Preview": true,
	"axiom7Preview": true,
};
/**
 * @description the main execution method. all methods, from UI to
 * graph-modifying should pass through this method. pre and post-
 * execute event methods can be called, and the effect of calling
 * a method here will print it to the history log in the terminal.
 */
export const execute = (funcName, ...args) => {
	const func = Functions[funcName];
	if (!func) {
		console.error(new Error("no known function with that name"));
		return;
	}
	if (previewFunctions[funcName]) {
		return func(...args);
	}
	let res;
	const preEvents = get(preExecuteEvents);
	const postEvents = get(postExecuteEvents);
	try {
		preEvents.forEach(fn => fn(funcName, ...args));
		res = func(...args);
		postEvents.forEach(fn => fn(funcName, ...args));
	} catch (error) {
		console.error(error);
		return res;
	}
	let argsClone = args;
	try {
		argsClone = structuredClone(args);
	} catch (error) {
		console.error(error);
	}
	const newHistory = [];
	newHistory.push(...preEvents.map(fn => ({ func: fn, args: [] })));
	newHistory.push({ func, args: argsClone });
	newHistory.push(...postEvents.map(fn => ({ func: fn, args: [] })));
	TerminalHistory.update(history => [...history, ...newHistory]);
	return res;
};

export const executeString = (str) => {
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
		console.error(error);
		return;
	}
	console.log("insideParen", insideParen);
	console.log("fnName", fnName);
	console.log("argsStr", argsStr);
	console.log("args", args);
	execute(fnName, ...args);
};
