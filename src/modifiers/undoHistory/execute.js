import { parseListToMethodNames } from "../general.js";
import {
	UndoHistoryAvoidCommands,
	cache,
	undo,
	redo,
} from "./stores.js";

const execute = (commands = []) => {
	const avoid = UndoHistoryAvoidCommands;
	const matches = parseListToMethodNames(commands)
		.filter(name => !avoid[name]);
	if (!matches.length) { return; }
	if (matches.includes("undo")) { return undo(); }
	if (matches.includes("redo")) { return redo(); }
	cache();
};

export default execute;
