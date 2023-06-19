import { writable } from "svelte/store";

export const history = writable([]);
export const textarea = writable(undefined);
export const textareaValue = writable(undefined);
