import { TerminalHistory } from "../stores/History.js";
import execute from "./execute.js";

const executeTerminal = (str) => {
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
		// console.error(error);
		TerminalHistory.update(history => [
			...history,
			{ html: `<span class="error">${error}</span>` },
		]);
		return;
	}
	// console.log("insideParen", insideParen);
	// console.log("fnName", fnName);
	// console.log("argsStr", argsStr);
	// console.log("args", args);
	execute(fnName, ...args);
};

export default executeTerminal;
