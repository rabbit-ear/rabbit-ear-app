// import { get } from "svelte/store";
// import { CreasePattern } from "../../stores/ModelCP.js";
// import { RulersCP } from "../../stores/Ruler.js";
// import { pleat as fnPleat } from "rabbit-ear/graph/pleat.js";
// import { clampLine } from "rabbit-ear/math/line.js";
// import { includeL } from "rabbit-ear/math/compare.js";
// import { GuideLinesCP } from "../../stores/UI.js";

// export const doPleat = (graph, edgeA, edgeB, count) => {
// 	if (edgeA === undefined || edgeB === undefined) { return []; }
// 	const result = fnPleat(graph, edgeA, edgeB, count);
// 	return result.flat();
// };

// export const pleat = (...args) => (
// 	// RulerLines.set(doPleat(get(CreasePattern), ...args))
// 	RulersCP.set(doPleat(get(CreasePattern), ...args)
// 		.map(line => ({ line, clamp: clampLine, domain: includeL })))
// );

// // export const pleatPreview = (...args) => (
// // 	UILines.add(doPleat(get(CreasePattern), ...args))
// // );
// export const pleatPreview = (...args) => (
// 	[]
// );
