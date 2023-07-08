import { writable } from "svelte/store";
import { snapPoints } from "./snap.js";

const { subscribe, set, update } = writable([]);

export const rulerLines = {
	subscribe,
	update,
	set: (newLines) => {
		const res = set(newLines);
		snapPoints.recalculate();
		return res;
	},
};
