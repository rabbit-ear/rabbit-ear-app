import { writable } from "svelte/store";
import modifiers from "../modifiers/index.js";

export const Modifiers = writable([
	modifiers.undoHistory,
	modifiers.autoPlanarize,
]);
