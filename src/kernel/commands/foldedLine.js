import { get } from "svelte/store";
import {
	CreasePattern,
	UpdateFrame,
} from "../../stores/Model.js";
import repeatFold from "rabbit-ear/graph/flatFold/repeatFold.js";
import { subtract2 } from "rabbit-ear/math/vector.js";
import { edgeAssignmentToFoldAngle } from "rabbit-ear/fold/spec.js";
import { UIGraph } from "../../stores/UI.js";

export const foldedLine = (a, b) => {
	const line = { vector: subtract2(b, a), origin: a };
	try {
		const graph = get(CreasePattern);
		const result = repeatFold(graph, line, "V")
			.filter(a => a !== undefined);
		const vertCount = graph.vertices_coords.length;
		graph.vertices_coords.push(...result.flatMap(el => el.points));
		graph.edges_vertices.push(...result
			.map((_, i) => [vertCount + i * 2, vertCount + i * 2 + 1]));
		graph.edges_assignment.push(...result.map(el => el.assignment));
		graph.edges_foldAngle.push(...result
			.map(el => el.assignment)
			.map(a => edgeAssignmentToFoldAngle(a)));
		UpdateFrame({ ...graph });
	} catch (error) {
		console.error(error);
	}
};

export const foldedLinePreview = (a, b) => {
	const line = { vector: subtract2(b, a), origin: a };
	// return repeatFold(get(CreasePattern), line, "V");
	try {
		const result = repeatFold(get(CreasePattern), line, "V")
			.filter(a => a !== undefined);
		// console.log("graph", {
		// 	vertices_coords: result.flatMap(el => el.points),
		// 	edges_vertices: result.map((_, i) => [i * 2, i * 2 + 1]),
		// });
		UIGraph.set({
			vertices_coords: result.flatMap(el => el.points),
			edges_vertices: result.map((_, i) => [i * 2, i * 2 + 1]),
		});
	} catch (error) {
		console.error(error);
	}
};
