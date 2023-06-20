import { get, writable } from "svelte/store";
import { history } from "../stores/terminal.js";
import * as Functions from "./functions.js";

export const preExecuteEvents = writable([]);
export const postExecuteEvents = writable([]);

export const execute = (funcName, ...args) => {
	const func = Functions[funcName];
	if (!func) {
		console.error(new Error("no known function with that name"));
		return;
	}
	let res;
	try {
		// pass in the func (or name of the func) so that we can customize
		// each pre-execute event depending on which event is to follow.
		get(preExecuteEvents).forEach(fn => fn(func));
		res = func(...args);
		// same with post-execute events.
		get(postExecuteEvents).forEach(fn => fn(func));
	} catch (error) {
		console.error(error);
		return res;
	}
	history.set([...get(history), { func, args }]);
	return res;
};

// export const executeString = (str) => {
// 	const funcName = str.match(/^[^(]*/);
// 	const func = Functions[funcName];
// 	if (!func) {
// 		console.error(new Error("no known function with that name"));
// 		return;
// 	}
// 	console.log("executeString", funcName, funcName.length);
// 	const parenthesis = str.slice(funcName.length);
// 	console.log("executeString", funcName, funcName.length, parenthesis);
// 	const argsString = parenthesis.match(/^\([^"]+\)/);
// 	console.log("argsString", argsString);
// };
