import { writable } from "svelte/store";

const { subscribe, set, update } = writable([]);

export const Rulers = {
	subscribe,
	set,
	update,
	reset: () => set([]),
}

export const RulerPreviews = writable([]);
