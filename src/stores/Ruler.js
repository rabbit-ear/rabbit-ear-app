import { writable, derived } from "svelte/store";
import {
	intersectGraphLine,
	intersectGraphRay,
	intersectGraphSegment,
} from "../js/intersect.js";
import {
	CreasePattern,
	FoldedFormPlanar,
} from "./Model.js";
/**
 * @description Lines which are intended to be a step towards
 * adding new geometry to the graph; affects the list of UI snap points.
 */
export const RulerLines = writable([]);
/**
 * @description Rays which are intended to be a step towards
 * adding new geometry to the graph; affects the list of UI snap points.
 */
export const RulerRays = writable([]);
/**
 * @description Rays which are intended to be a step towards
 * adding new geometry to the graph; affects the list of UI snap points.
 */
export const RulerSegments = writable([]);
/**
 * @description A list of points that are the intersection of all
 * Ruler Lines and Rays with all graph edges.
 */
export const RulerPointsCP = derived(
	[CreasePattern, RulerLines, RulerRays, RulerSegments],
	([$CreasePattern, $RulerLines, $RulerRays, $RulerSegments]) => {
		try {
			// todo, filter, remove duplicates
			const intersectedLines = $RulerLines
				.flatMap(line => intersectGraphLine($CreasePattern, line));
			const intersectedRays = $RulerRays
				.flatMap(ray => intersectGraphRay($CreasePattern, ray));
			const intersectedSegments = $RulerSegments
				.flatMap(segment => intersectGraphSegment($CreasePattern, segment));
			// todo: intersect lines and rays against themselves
			return [...intersectedLines, ...intersectedRays, ...intersectedSegments];
		} catch (error) {
			console.warn("RulerPoints", error);
		}
		return [];
	},
	[],
);

export const RulerPointsFolded = derived(
	[FoldedFormPlanar, RulerLines, RulerRays, RulerSegments],
	([$FoldedFormPlanar, $RulerLines, $RulerRays, $RulerSegments]) => {
		try {
			// todo, filter, remove duplicates
			const intersectedLines = $RulerLines
				.flatMap(line => intersectGraphLine($FoldedFormPlanar, line));
			const intersectedRays = $RulerRays
				.flatMap(ray => intersectGraphRay($FoldedFormPlanar, ray));
			const intersectedSegments = $RulerSegments
				.flatMap(segment => intersectGraphSegment($FoldedFormPlanar, segment));
			// todo: intersect lines and rays against themselves
			return [...intersectedLines, ...intersectedRays, ...intersectedSegments];
		} catch (error) {
			console.warn("RulerPoints", error);
		}
		return [];
	},
	[],
);
