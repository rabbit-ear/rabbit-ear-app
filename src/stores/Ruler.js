import { writable, derived, get } from "svelte/store";
import {
	intersectGraphLine,
	intersectGraphRay,
} from "../js/intersect.js";
import { RulersAutoClear } from "./App.js";
import { Graph } from "./Model.js";
import { Snapping } from "./App.js";
/**
 *
 */
export const RulerLines = writable([]);
RulerLines.add = (newRulers) => RulerLines.update((r) => get(RulersAutoClear)
	? [...newRulers]
	: [...r, ...newRulers]);
/**
 *
 */
export const RulerRays = writable([]);
RulerRays.add = (newRulers) => RulerRays.update((r) => get(RulersAutoClear)
	? [...newRulers]
	: [...r, ...newRulers]);
/**
 *
 */
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
