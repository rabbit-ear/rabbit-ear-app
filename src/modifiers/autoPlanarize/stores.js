import { writable } from "svelte/store";

export const PlanarizeCommands = writable({
	snapAllVertices: true,
	segment: true,
	translate: true,
	translateVertices: true,
	deleteComponents: true,
	foldedLine: true,
});
