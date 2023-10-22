import { clampLine, clampRay, clampSegment } from "rabbit-ear/math/line.js";
import { includeL, includeR, includeS } from "rabbit-ear/math/compare.js";
import {
	RulersCP,
	RulersFolded,
} from "../../stores/Ruler.js";
import {
	UILines,
	UIRays,
} from "../../stores/UI.js";

export const setRulersCP = (lines = []) => RulersCP
	.set(lines
		.filter(a => a !== undefined)
		.map(line => ({ line, clamp: clampLine, domain: includeL })));
export const setRulersFolded = (lines = []) => RulersFolded
	.set(lines
		.filter(a => a !== undefined)
		.map(line => ({ line, clamp: clampLine, domain: includeL })));
export const setRulerRaysCP = (lines = []) => RulersCP
	.set(lines
		.filter(a => a !== undefined)
		.map(line => ({ line, clamp: clampRay, domain: includeR })));
export const setRulerRaysFolded = (lines = []) => RulersFolded
	.set(lines
		.filter(a => a !== undefined)
		.map(line => ({ line, clamp: clampRay, domain: includeR })));
export const setRulerSegmentsCP = (lines = []) => RulersCP
	.set(lines
		.filter(a => a !== undefined)
		.map(line => ({ line, clamp: clampSegment, domain: includeS })));
export const setRulerSegmentsFolded = (lines = []) => RulersFolded
	.set(lines
		.filter(a => a !== undefined)
		.map(line => ({ line, clamp: clampSegment, domain: includeS })));


export const setUILines = (lines = []) => UILines
	.set(lines
		.filter(a => a !== undefined)
		.map(line => ({ line, clamp: clampLine, domain: includeL })));
export const setUIRays = (rays = []) => UIRays
	.set(rays
		.filter(a => a !== undefined)
		.map(line => ({ line, clamp: clampRay, domain: includeR })));
