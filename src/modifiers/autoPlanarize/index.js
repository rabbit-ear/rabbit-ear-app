import { get } from "svelte/store";
import { PlanarizeMethods } from "./stores.js";
import { callIfIncluded } from "../general.js";

export const autoPlanarize = (commands = []) => {
	if (callIfIncluded(commands, get(PlanarizeMethods))) {
		commands.push("planarize()");
	}
};
