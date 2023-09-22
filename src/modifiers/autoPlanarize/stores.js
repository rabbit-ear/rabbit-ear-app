import { writable } from "svelte/store";

// todo: need to review all the methods 
export const PlanarizeCommands = writable({
	snapAllVertices: true,
	segment: true,
	deleteComponents: true,
	foldedLine: true,
	mergeNearbyVertices: true,
	mergeVertices: true,
	mergeSelectedVertices: true,
	// translateAll: true,
	// translateVertices: true,
	// translate: true,
	// scaleAll: true,
	// scaleVertices: true,
	// scale: true,
});
