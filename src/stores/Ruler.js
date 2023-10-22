import { writable, derived } from "svelte/store";
import { clampRay } from "rabbit-ear/math/line.js";
import { includeR } from "rabbit-ear/math/compare.js";
import { intersectGraphLineFunc } from "../js/intersect.js";
import {
	CreasePattern,
	FoldedFormPlanar,
} from "./Model.js";

export const RadialRays = (origin, degrees = 22.5, offset = 0) => Array
	.from(Array(Math.ceil(360 / degrees)))
	.map((_, i) => Math.PI * ((offset + i * degrees) / 180))
	.map(a => [Math.cos(a), Math.sin(a)])
	.map(vector => ({ vector, origin }))
	.map(line => ({ line, clamp: clampRay, domain: includeR }));
/**
 * @description Lines which are intended to be a step towards
 * adding new geometry to the graph; affects the list of UI snap points.
 */
export const RulersCP = writable([]);

export const RulersFolded = writable([]);
/**
 * @description A list of points that are the intersection of all
 * Ruler Lines and Rays with all graph edges.
 */
export const RulerPointsCP = derived(
	[CreasePattern, RulersCP],
	([$CreasePattern, $RulersCP]) => {
		try {
			// todo, filter, remove duplicates
			// todo: intersect lines and rays against themselves
			return $RulersCP.flatMap(ruler => (
				intersectGraphLineFunc($CreasePattern, ruler.line, ruler.domain)));
		} catch (error) {
			console.warn("RulerPoints", error);
		}
		return [];
	},
	[],
);

export const RulerPointsFolded = derived(
	[FoldedFormPlanar, RulersFolded],
	([$FoldedFormPlanar, $RulersFolded]) => {
		try {
			return $RulersFolded.flatMap(ruler => (
				intersectGraphLineFunc($FoldedFormPlanar, ruler.line, ruler.domain)));
		} catch (error) {
			console.warn("RulerPoints", error);
		}
		return [];
	},
	[],
);
