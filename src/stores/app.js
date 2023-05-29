import { writable } from "svelte/store";

export const tool = writable("newVertex");

export const selectElement = writable("vertex");

export const darkMode = writable(true);

// stroke width of the crease edges
export const strokeWidth = writable(0.0025);

// export const viewBox = writable([0, 0, 16, 16]);
export const viewBox = writable([0, 0, 12, 12]);
