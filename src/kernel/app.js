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
 * @description "preview" functions do not run the pre and post events
 * because they simply generate UI Previews. in fact, I kind of feel
 * like they shouldn't even be running through the kernel to begin with.
 */
const previewFunctions = {
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
 *
 */
const formatFunctionResult = (result) => {
	const prompt = `<span class="prompt-symbol">&gt;</span>`;
	switch (typeof result) {
	case "boolean": return `${prompt} <span class="return">${result}</span>`;
	case "number": return `${prompt} <span class="return">${result}</span>`;
	case "string": return `${prompt} <span class="return">${result}</span>`;
	case "object": return `${prompt} <span class="return">${JSON.stringify(result)}</span>`;
	case "function": break;
	}
};
/**
 *
 */
const formatFunctionCall = (functionName, args) => {
	let params;
	try {
		params = structuredClone(args);
	} catch (error) {
		throw new Error(`<span class="error">${error}</span>`);
	}
	const paramsString = params
		? params
			.map(arg => JSON.stringify(arg))
			.map(string => string.length > 1000 ? "[JSON]" : string)
			.map(a => `<span class="param">${a}</span>`)
			.join(", ")
		: ""
	return `<span class="function">${functionName}</span>(${paramsString})`
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
		const error = new Error(`no known function with the name "${funcName}"`);
		TerminalHistory.update(history => [
			...history,
			{ html: `<span class="error">${error}</span>` },
		]);
		return;
	}
	if (previewFunctions[funcName]) {
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
		newHistory.push({ html: formatFunctionCall(func.name, args) });
	} catch (error) {
		newHistory.push({ html: error });
		return;
	}
	if (res !== undefined) {
		newHistory.push({ html: formatFunctionResult(res) });
	}
	TerminalHistory.update(history => [...history, ...newHistory]);
	return res;
};
/**
 *
 */
// export const executeUI = (funcName, ...args) => {
// 	const func = Functions[funcName];
// 	if (!func) {
// 		const error = new Error(`no known function with the name "${funcName}"`);
// 		TerminalHistory.update(history => [
// 			...history,
// 			{ html: `<span class="error">${error}</span>` },
// 		]);
// 		return;
// 	}
// 	let res;
// 	try {
// 		res = func(...args);
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
// 		newHistory.push({ html: formatFunctionCall(func.name, args) });
// 	} catch (error) {
// 		newHistory.push({ html: error });
// 		return;
// 	}
// 	if (res !== undefined) {
// 		newHistory.push({ html: formatFunctionResult(res) });
// 	}
// 	TerminalHistory.update(history => [...history, ...newHistory]);
// 	return res;
// };
/**
 *
 */
// export const executeString = (str) => {
// 	const preParen = str.match(/^[^(]*/);
// 	const insideParen = str.match(/\(([^\)]+)\)/);
// 	const fnName = preParen[0];
// 	const argsStr = (!insideParen || insideParen.length < 2
// 		? ""
// 		: insideParen[1]);
// 	let args;
// 	try {
// 		args = JSON.parse(`[${argsStr}]`);
// 	} catch (error) {
// 		// console.error(error);
// 		TerminalHistory.update(history => [
// 			...history,
// 			{ html: `<span class="error">${error}</span>` },
// 		]);
// 		return;
// 	}
// 	// console.log("insideParen", insideParen);
// 	// console.log("fnName", fnName);
// 	// console.log("argsStr", argsStr);
// 	// console.log("args", args);
// 	execute(fnName, ...args);
// };
