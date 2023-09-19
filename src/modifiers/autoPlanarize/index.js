import { get } from "svelte/store";
import { PlanarizeCommands } from "./stores.js";
import { callIfIncluded } from "../general.js";

const execute = (commands = []) => {
	if (callIfIncluded(commands, get(PlanarizeCommands))) {
		commands.push("planarize()");
	}
};

export default {
	key: "autoPlanarize",
	name: "auto-planarize",
	execute,
};
