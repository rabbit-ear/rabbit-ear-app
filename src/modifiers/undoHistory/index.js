import { get } from "svelte/store";
import jsTokens from "../../lib/js-tokens/index.js";
import { callIfNotIncluded } from "../general.js";
import panel from "./panel.svelte";
import {
	UndoHistoryAvoidCommands,
	cache,
	undo,
	redo,
} from "./stores.js";

const parseJS = (js) => Array.from(jsTokens(js));

const parseMethodNames = (js) => parseJS(js)
	.filter(el => el.type === "IdentifierName")
	.filter(el => !UndoHistoryAvoidCommands[el.value])
	.map(el => el.value);

const execute = (commands = []) => {
	const methods = commands.flatMap(parseMethodNames);
	if (!methods.length) { return; }
	if (methods.includes("undo")) { return undo(); }
	if (methods.includes("redo")) { return redo(); }
	cache();
};

export default {
	key: "undoHistory",
	name: "undo history",
	execute,
	panel,
}