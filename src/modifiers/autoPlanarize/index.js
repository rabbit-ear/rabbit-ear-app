import { get } from "svelte/store";
import { PlanarizeMethods } from "./stores.js";

export const autoPlanarize = (commands = []) => {
	const planarizeMethods = get(PlanarizeMethods)
	if (commands.filter(el => planarizeMethods[el.name]).length > 0) {
		commands.push({ name: "planarize", args: [] });
	}
};
