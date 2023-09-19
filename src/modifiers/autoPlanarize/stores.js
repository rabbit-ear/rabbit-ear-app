import { writable } from "svelte/store";

// todo: need to review all the methods 
export const PlanarizeCommands = writable({
	snapAllVertices: true,
	segment: true,
	translate: true,
	translateVertices: true,
	deleteComponents: true,
	foldedLine: true,
	mergeNearbyVertices: true,
	mergeVertices: true,
	mergeSelectedVertices: true,
});
