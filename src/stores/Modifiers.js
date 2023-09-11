import { writable } from "svelte/store";
import modifiers from "../modifiers/index.js";

// export const Modifiers = writable([]);

export const Modifiers = writable([
	modifiers.autoPlanarize,
]);