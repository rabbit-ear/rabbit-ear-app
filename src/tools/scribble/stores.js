import { writable } from "svelte/store";

export const ScribbleSmooth = writable(true);
export const ScribbleSmoothAmount = writable(0.5);
export const ScribbleDensity = writable(0.5);
export const ScribbleWaitForConfirmation = writable(false);
