import { writable } from "svelte/store";

/**
 * @description list of methods which should NOT be followed
 * by a save history state.
 */
export const AddToHistoryMethods = writable({
	download: true,
	kawasakiRulers: true,
});
