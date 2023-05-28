import { writable } from "svelte/store";

// the rendering style: "foldedForm" or "creasePattern"
export const viewClass = writable("creasePattern");

export const darkMode = writable(true);

// stroke width of the crease edges
export const strokeWidth = writable(0.0025);

export const viewBox = writable([0, 0, 10, 10]);
