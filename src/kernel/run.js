import * as Commands from "./commands/index.js";
import {
	formatCommandResult,
	formatCommandCall,
} from "./format.js";

// return array of terminal output lines
const run = (name, ...args) => {
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

export default run;
