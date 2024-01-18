import { writable } from "svelte/store";

// todo: need to review all the methods 
export const PlanarizeCommands = writable({
	snapAllVertices: true,
	segment: true,
	rect: true,
	deleteComponents: true,
	foldedLine: true,
	foldedSegment: true,
	mergeNearbyVertices: true,
	mergeVertices: true,
	mergeSelectedVertices: true,
	pleat: true,
	pleatCP: true,
	translateAll: true,
	translateVertices: true,
	translate: true,
	scaleAll: true,
	scaleVertices: true,
	scaleUniform: true,
	scale: true,
	rotateAll: true,
	rotateVertices: true,
	rotateZ: true,
});
