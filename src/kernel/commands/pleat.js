import { get } from "svelte/store";
import { CreasePattern } from "../../stores/ModelCP.js";
import { RulersCP } from "../../stores/Ruler.js";
import { pleat as earPleat } from "rabbit-ear/graph/pleat.js";
import { clampLine } from "rabbit-ear/math/line.js";
import { includeL } from "rabbit-ear/math/compare.js";
import { GuideLinesCP } from "../../stores/UI.js";
import AddVertex from "rabbit-ear/graph/add/addVertex.js";
import addPlanarLine from "rabbit-ear/graph/add/addPlanarLine.js";
import addNonPlanarEdge from "rabbit-ear/graph/add/addNonPlanarEdge.js";
import { NewEdgeAssignment } from "../../stores/App.js";
import { setEdgesAssignment } from "../../js/graph.js";
import { UpdateFrame } from "../../stores/Model.js";

// export const doPleat = (graph, edgeA, edgeB, count) => {
// 	if (edgeA === undefined || edgeB === undefined) { return []; }
// 	const result = earPleat(graph, edgeA, edgeB, count);
// 	return result.flat();
// };

// export const pleat = (...args) => (
// 	// RulerLines.set(doPleat(get(CreasePattern), ...args))
// 	RulersCP.set(doPleat(get(CreasePattern), ...args)
// 		.map(line => ({ line, clamp: clampLine, domain: includeL })))
// );

// export const pleat = (edgeA, edgeB, count, assignments = ["F"], alt = false) => {
// 	if (edgeA === undefined || edgeB === undefined) { return []; }
// 	// RulerLines.set(doPleat(get(CreasePattern), ...args))
// 	const graph = get(CreasePattern);
// 	const result = earPleat(graph, edgeA, edgeB, count);
// 	let group = alt ? 1 : 0;
// 	if (group === 0 && !result[0].length && result[1].length) { group = 1; }
// 	if (group === 1 && result[0].length && !result[1].length) { group = 0; }
// 	// if (result[0].length && !result[1].length) { group = 0; }
// 	// if (!result[0].length && result[1].length) { group = 1; }
// 	// const assignment = get(NewEdgeAssignment);
// 	// result.forEach(segs => segs.forEach(([coords0, coords1], i) => {
// 	result[group].forEach(([coords0, coords1], i) => {
// 		const assignment = assignments[i % assignments.length];
// 		// console.log("coords", coords0, coords1);
// 		const vertex0 = AddVertex(graph, coords0);
// 		const vertex1 = AddVertex(graph, coords1);
// 		const edge = addNonPlanarEdge(graph, [vertex0, vertex1]);
// 		setEdgesAssignment(graph, [edge], assignment);
// 	});
// 	UpdateFrame({ ...graph });
// };

// export const pleatPreview = (...args) => (
// 	UILines.add(doPleat(get(CreasePattern), ...args))
// );
// export const pleatPreview = (edgeA, edgeB, count, assignments = ["F"], alt = false) => {
// 	console.log("preview", edgeA, edgeB, count, assignments);
// 	return [];
// 	// if (edgeA === undefined || edgeB === undefined) { return []; }
// 	// const graph = get(CreasePattern);
// 	// const result = earPleat(graph, edgeA, edgeB, count);
// 	// result.forEach(segs => segs.forEach(([coords0, coords1], i) => {
// 	// 	const assignment = assignments[i % assignments.length];
// 	// 	const vertex0 = AddVertex(graph, coords0);
// 	// 	const vertex1 = AddVertex(graph, coords1);
// 	// 	const edge = addNonPlanarEdge(graph, [vertex0, vertex1]);
// 	// 	setEdgesAssignment(graph, [edge], assignment);
// 	// }));
// };

export const pleatCP = (edgeA, edgeB, count, assignments = ["F"], alt = false) => {
	if (edgeA === undefined || edgeB === undefined) { return []; }
	// RulerLines.set(doPleat(get(CreasePattern), ...args))
	const result = earPleat(get(CreasePattern), edgeA, edgeB, count);
	let group = alt ? 1 : 0;
	if (group === 0 && !result[0].length && result[1].length) { group = 1; }
	if (group === 1 && result[0].length && !result[1].length) { group = 0; }
	// if (result[0].length && !result[1].length) { group = 0; }
	// if (!result[0].length && result[1].length) { group = 1; }
	const graph = {};
	result[group].forEach(([coords0, coords1], i) => {
		const assignment = assignments[i % assignments.length];
		// console.log("coords", coords0, coords1);
		const vertex0 = AddVertex(graph, coords0);
		const vertex1 = AddVertex(graph, coords1);
		const edge = addNonPlanarEdge(graph, [vertex0, vertex1]);
		setEdgesAssignment(graph, [edge], assignment);
	});
	// console.log(graph);
	return graph;
};
