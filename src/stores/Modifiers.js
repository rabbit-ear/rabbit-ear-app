import { writable } from "svelte/store";
import modifiers from "../modifiers/index.js";
/**
 * @description The list of modifiers that are currently
 * "turned on". These are turned on by default.
 */
export const Modifiers = writable([
	modifiers.undoHistory,
	modifiers.autoPlanarize,
	modifiers.symmetry,
]);
/**
 * @description These modifiers will be marked as required,
 * which means the user is not allowed to turn them off and on.
 * Technically, they are not required, the app will still
 * function just fine if any modifier is turned off.
 */
export const FixedModifiers = {
	"undoHistory": true,
};
