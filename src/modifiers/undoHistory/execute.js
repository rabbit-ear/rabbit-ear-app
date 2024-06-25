import { parseListToMethodNames } from "../general.js";
import { UndoHistoryAvoidCommands, cache, undo, redo } from "./stores.js";

const execute = (commands = []) => {
	const avoid = UndoHistoryAvoidCommands;
	const methodNames = parseListToMethodNames(commands);
	const matches = methodNames.filter((name) => avoid[name]);
	if (matches.length) {
		return;
	}
	if (methodNames.includes("undo")) {
		return undo();
	}
	if (methodNames.includes("redo")) {
		return redo();
	}
	cache();
};

export default execute;
