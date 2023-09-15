import ear from "rabbit-ear";
import Commands from "./commands/index.js";
import {
	formatCommandResult,
	formatCommandCall,
} from "./format.js";

// the context which will bind to the Function's this.
const context = Object.assign({ ear }, Commands);

// return array of terminal output lines
export const runCommand = (name, ...args) => {
	let result;
	const fn = Commands[name];
	try {
		if (!fn) {
			throw new Error(`no known function with the name "${name}"`);
		}
		result = fn(...args);
	} catch (error) {
		// console.error(error);
		return [{ html: `<span class="error">${error}</span>` }];
	}
	return [
		{ html: formatCommandCall(fn.name, args) },
		{ html: formatCommandResult(result) },
	].filter(a => a.html !== undefined);
};

// transfer all methods/constants from inside the "this."
// and into the top level of the scope.
const hoist = Object.keys(context)
	.map(name => `var ${name} = this.${name};`)
	.join("\n");

// console.log("context", context);
const scopedEval = (scope, script, result) => {
	// const fileString = files
	// 	.map(f => `var ${f.name} = this.${f.name};`).join("");
	try {
		// return Function(`; ${hoist}; ${fileString}; return ${script}`).bind(scope)();
		return Function(`; ${hoist}; return ${script}`).bind(scope)();
	} catch (e) {
		try {
			return Function(`; ${hoist}; ${script}`).bind(scope)();
		} catch (error) {
			throw error;
		}
	}
};

// return array of terminal output lines
export const run = (command) => {
	let result;
	// const result = { value: undefined, error: undefined };
	try {
		// files.forEach(f => { context[f.name] = f.contents; });
		result = scopedEval(context, command, result);
	}
	catch (error) {
		return [{ html: `<span class="error">${error}</span>` }];
	}
	// updateHistory(command, result);
	console.log(command, result);
	return [
		{ html: formatCommandCall(fn.name, args) },
		{ html: formatCommandResult(result) },
	].filter(a => a.html !== undefined);
};
