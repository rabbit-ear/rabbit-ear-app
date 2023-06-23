import { writable } from "svelte/store";

// settings to fine-tune the simulator's solver
export const integration = writable("euler");
export const axialStiffness = writable(20);
export const faceStiffness = writable(0.2);
export const joinStiffness = writable(0.7);
export const creaseStiffness = writable(0.7);
export const dampingRatio = writable(0.45);
