import { writable } from "svelte/store";
import { snapPoints } from "./snap.js";

const { subscribe, set, update } = writable([]);

export const rulerLines = {
	subscribe,
	update,
	set: (newLines) => {
		const res = set(newLines);
		snapPoints.updatePoints();
		return res;
	},
};

setTimeout(() => rulerLines.set([{ vector: [0, 1], origin: [0.5, 0] }]), 1000);
