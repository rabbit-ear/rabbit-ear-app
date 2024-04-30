import ear from "rabbit-ear";
import Commands from "./commands/index.js";
import {
	terminalOutputCommandResult,
	terminalOutputJavascript,
	terminalOutputError,
} from "./format.js";

// the context which will bind to the Function's this.
const context = Object.assign({ ...ear }, Commands);

// transfer all methods/constants from inside the "this."
// and into the top level of the scope.
const hoist = Object.keys(context)
	.map(name => `var ${name} = this.${name};`)
	.join("\n");
/**
 * @description run a Javascript blob in a context.
 * @param {string} jsBlob a snippet of Javascript code to be run
 * @param {object} scope the context to be bound to the function
 * @returns {any} whatever the Javascript code was meant to return
 * which, if the Javascript contains multiple lines of code, the return
 * object will be whatever the final line of code returns, or
 * "undefined" if nothing is returned.
 */
const scopedEval = (jsBlob, scope) => {
	// const fileString = files
	// 	.map(f => `var ${f.name} = this.${f.name};`).join("");
	try {
		// return Function(`; ${hoist}; ${fileString}; return ${jsBlob}`).bind(scope)();
		return Function(`; ${hoist}; return ${jsBlob}`).bind(scope)();
	} catch (e) {
		try {
			return Function(`; ${hoist}; ${jsBlob}`).bind(scope)();
		} catch (error) {
			throw error;
		}
	}
};
/**
 * @description run a javascript blob in an eval context which includes
 * all commands from the core of the app.
 * @param {string} jsBlob a javascript snippet
 * @returns {object[]} an array of objects meant for printing
 * as output into the terminal.
 */
export const run = (jsBlob) => {
	let result;
	try {
		// files.forEach(f => { context[f.name] = f.contents; });
		result = scopedEval(jsBlob, context);
	}
	catch (error) {
		console.error(error);
		return [
			terminalOutputJavascript(jsBlob),
			terminalOutputError(error),
		];
	}
	// if the scoped eval returns undefined, the resulting html string
	// will be an empty string, if this is the case, don't include empty
	// strings in the terminal output.
	return [
		terminalOutputJavascript(jsBlob),
		terminalOutputCommandResult(result),
	].filter(a => a.html !== undefined);
};
