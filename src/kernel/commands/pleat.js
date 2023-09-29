import { get } from "svelte/store";
import { Graph } from "../../stores/Model.js";
import { RulerLines } from "../../stores/Ruler.js";
import { pleat as fnPleat } from "rabbit-ear/graph/pleat.js";
import { UILines } from "../../stores/UI.js";

export const doPleat = (graph, edgeA, edgeB, count) => {
	if (edgeA === undefined || edgeB === undefined) { return []; }
	const result = fnPleat(graph, edgeA, edgeB, count);
	return result.flat();
};

export const pleat = (...args) => (
	RulerLines.set(doPleat(get(Graph), ...args))
);

// export const pleatPreview = (...args) => (
// 	UILines.add(doPleat(get(Graph), ...args))
// );
export const pleatPreview = (...args) => (
	[]
);
