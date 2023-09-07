import { writable } from "svelte/store";

export const SelectHoverIndex = writable({
	vertex: undefined,
	edge: undefined,
	face: undefined,
});
