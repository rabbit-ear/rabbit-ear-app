import { clampLine, clampRay } from "rabbit-ear/math/line.js";
import { includeL, includeR } from "rabbit-ear/math/compare.js";
import { RulersCP } from "../../stores/Ruler.js";
import {
	UILines,
	UIRays,
} from "../../stores/UI.js";

// export const resetRulers = () => {
// 	RulerLines.set([]);
// 	RulerRays.set([]);
// };

const RadialRays = (origin, degrees = 22.5, offset = 0) => Array
	.from(Array(Math.ceil(360 / degrees)))
	.map((_, i) => Math.PI * ((offset + i * degrees) / 180))
	.map(a => [Math.cos(a), Math.sin(a)])
	.map(vector => ({ vector, origin }))
	.map(line => ({ line, clamp: clampRay, domain: includeR }));

// export const radialRulers = (origin, degrees = 22.5, offset = 0) => RulerRays
export const radialRulers = (origin, degrees = 22.5, offset = 0) => RulersCP
	.set(RadialRays(origin, degrees, offset));

// export const setRulerLines = (lines = []) => RulerLines
export const setRulerLines = (lines = []) => RulersCP
	.set(lines
		.filter(a => a !== undefined)
		.map(line => ({ line, clamp: clampLine, domain: includeL })));
// export const setRulerRays = (rays = []) => RulerRays
export const setRulerRays = (rays = []) => RulersCP
	.set(rays
		.filter(a => a !== undefined)
		.map(line => ({ line, clamp: clampRay, domain: includeR })));
export const setUILines = (lines = []) => UILines
	.set(lines
		.filter(a => a !== undefined)
		.map(line => ({ line, clamp: clampLine, domain: includeL })));
export const setUIRays = (rays = []) => UIRays
	.set(rays
		.filter(a => a !== undefined)
		.map(line => ({ line, clamp: clampRay, domain: includeR })));

// const RadialLines = (origin, count = 16) => Array
// 	.from(Array(Math.floor(count / 2)))
// 	.map((_, i) => 2 * Math.PI * (i / count))
// 	.map(a => [Math.cos(a), Math.sin(a)])
// 	.map(vector => ({ vector, origin }));

// export const radialRulers = (origin, count = 16) => RulerLines
// 	.set(RadialLines(origin, count));

