import { writable, derived, get } from "svelte/store";
import {
	intersectGraphLine,
	intersectGraphRay,
} from "../js/intersect.js";
import { Graph } from "./Model.js";
import { RulersAutoClear } from "./App.js";
/**
 * @description Lines which are intended to be a step towards
 * adding new geometry to the graph; affects the list of UI snap points.
 */
export const RulerLines = writable([]);
RulerLines.add = (newRulers) => RulerLines.update((r) => get(RulersAutoClear)
	? [...newRulers]
	: [...r, ...newRulers]);
/**
 * @description Rays which are intended to be a step towards
 * adding new geometry to the graph; affects the list of UI snap points.
 */
export const RulerRays = writable([]);
RulerRays.add = (newRulers) => RulerRays.update((r) => get(RulersAutoClear)
	? [...newRulers]
	: [...r, ...newRulers]);
/**
 * @description A list of points that are the intersection of all
 * Ruler Lines and Rays with all graph edges.
 */
// export const RulerPoints = writable([]);
export const RulerPoints = derived(
	[Graph, RulerLines, RulerRays],
	([$Graph, $RulerLines, $RulerRays]) => {
		// todo, filter, remove duplicates
		const intersectedLines = $RulerLines
			.flatMap(line => intersectGraphLine($Graph, line));
		const intersectedRays = $RulerRays
			.flatMap(ray => intersectGraphRay($Graph, ray));
		// todo: intersect lines and rays against themselves
		return [...intersectedLines, ...intersectedRays];
	},
	[],
);
