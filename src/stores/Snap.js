import { writable, derived } from "svelte/store";
import {
	ViewportCP,
	ViewportFolded,
} from "./ViewBox.js";
import {
	RulerPointsCP,
	RulerPointsFolded,
} from "./Ruler.js";
import {
	CreasePattern,
	FoldedFormPlanar,
} from "./Model.js";
/**
 * @description Establish the angle between snapping lines, and the
 * offset from 0deg for the initial line.
 */
export const RadialSnapDegrees = writable(22.5);
export const RadialSnapOffset = writable(0);
/**
 * @description SnapPointsCP contains a list of 2D points
 * in the plane which the UI should be able to snap to.
 * This list notably does not contain a list of grid-points
 * (snap to grid) because that list is infinite and calculated
 * in the snap-point-finding method.
 * The list of points here includes:
 * - graph vertices
 * - intersections between ruler lines and graph edges
 * Currently, it does not include:
 * - intersections between ruler lines and ruler lines
 * - intersections between ruler lines and the background grid
 */
export const SnapPointsCP = derived(
	[CreasePattern, RulerPointsCP],
	([$CreasePattern, $RulerPointsCP]) => [
		...($CreasePattern.vertices_coords || []),
		...$RulerPointsCP,
	],
	[],
);
export const SnapPointsFolded = derived(
	[FoldedFormPlanar, RulerPointsFolded],
	([$FoldedFormPlanar, $RulerPointsFolded]) => [
		...($FoldedFormPlanar.vertices_coords || []),
		...$RulerPointsFolded,
	],
	[],
);
/**
 * @description Snapping is zoom-level dependent, this is the factor
 * (out of 1) which is scaled to the viewbox to get the snap radius.
 */
const SnapRadiusFactor = 0.05;
/**
 * @description This is the radius of the snapping range to the
 * nearest snappable point, it is dependent upon the current view zoom.
 */
export const SnapRadiusCP = derived(
	ViewportCP,
	$ViewportCP => (
		Math.max($ViewportCP[2], $ViewportCP[3]) * SnapRadiusFactor
	),
	0.05,
);

export const SnapRadiusFolded = derived(
	ViewportFolded,
	$ViewportFolded => (
		Math.max($ViewportFolded[2], $ViewportFolded[3]) * SnapRadiusFactor
	),
	0.05,
);
