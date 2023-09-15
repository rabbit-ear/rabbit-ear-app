import ear from "rabbit-ear";
import Commands from "./commands/index.js";
import {
	formatCommandResult,
	formatJavascript,
} from "./format.js";

// the context which will bind to the Function's this.
const context = Object.assign({ ...ear }, Commands);

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
export const run = (text) => {
	let result;
	try {
		// files.forEach(f => { context[f.name] = f.contents; });
		result = scopedEval(context, text, result);
	}
	catch (error) {
		return [{ html: `<span class="error">${error}</span>` }];
	}
	return [
		{ html: formatJavascript(text) },
		{ html: formatCommandResult(result) },
	].filter(a => a.html !== undefined);
};
