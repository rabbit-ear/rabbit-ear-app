import { get } from "svelte/store";
import { PlanarizeCommands } from "./stores.js";
import { parseListToMethodNames } from "../general.js";

const execute = (commands = []) => {
	const include = get(PlanarizeCommands);
	const matches = parseListToMethodNames(commands)
		.filter(name => include[name]);
	if (!matches.length) { return; }
	commands.push("planarize()");
};

export default execute;
