import { get } from "svelte/store";
import { PlanarizeCommands } from "./stores.js";
import { callIfIncluded } from "../general.js";

export const autoPlanarize = (commands = []) => {
	if (callIfIncluded(commands, get(PlanarizeCommands))) {
		commands.push("planarize()");
	}
};
