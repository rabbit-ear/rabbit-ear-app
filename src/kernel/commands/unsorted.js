import { get } from "svelte/store";
import splitEdge from "rabbit-ear/graph/splitEdge/index.js";
import { UpdateFrame } from "../../stores/Model.js";
import { CreasePattern } from "../../stores/ModelCP.js";
/**
 *
 */
export const test = (...args) => console.log(["test():"]
	.concat(args.map((arg, i) => `${i}:${typeof arg}:${JSON.stringify(arg)}`))
	.map(s => `${s}\n`)
	.join(""));
/**
 *
 */

export const splitEdges = (edges) => {
	const graph = get(CreasePattern);
	const result = edges
		.slice()
		.sort((a, b) => b - a)
		.map(edge => splitEdge(graph, edge));
	UpdateFrame({ ...graph });
};
