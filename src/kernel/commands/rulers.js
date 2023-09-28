import {
	RulerLines,
	RulerRays,
} from "../../stores/Ruler.js";
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
	.map(vector => ({ vector, origin }));

export const radialRulers = (origin, degrees = 22.5, offset = 0) => RulerRays
	.set(RadialRays(origin, degrees, offset));

export const setRulerLines = (lines = []) => RulerLines.set(lines.filter(a => a !== undefined));
export const setRulerRays = (rays = []) => RulerRays.set(rays.filter(a => a !== undefined));
export const setUILines = (lines = []) => UILines.set(lines.filter(a => a !== undefined));
export const setUIRays = (rays = []) => UIRays.set(rays.filter(a => a !== undefined));

// const RadialLines = (origin, count = 16) => Array
// 	.from(Array(Math.floor(count / 2)))
// 	.map((_, i) => 2 * Math.PI * (i / count))
// 	.map(a => [Math.cos(a), Math.sin(a)])
// 	.map(vector => ({ vector, origin }));

// export const radialRulers = (origin, count = 16) => RulerLines
// 	.set(RadialLines(origin, count));

