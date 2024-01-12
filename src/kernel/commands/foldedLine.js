import { get } from "svelte/store";
import { UpdateFrame } from "../../stores/Model.js";
import { CreasePattern } from "../../stores/ModelCP.js";
import { FoldedForm } from "../../stores/ModelFolded.js";
import repeatFold from "rabbit-ear/graph/flatFold/repeatFold.js";
import {
	subtract2,
} from "rabbit-ear/math/vector.js";
import { edgeAssignmentToFoldAngle } from "rabbit-ear/fold/spec.js";
import { GhostGraphCP } from "../../stores/UI.js";
import { splitSegmentWithGraph } from "rabbit-ear/graph/split.js";
import { mergeArraysWithHoles } from "rabbit-ear/general/array.js";
import {
	transferPointBetweenGraphs,
	transferPointOnEdgeBetweenGraphs,
} from "rabbit-ear/graph/transfer.js";

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
		GhostGraphCP.set({
			vertices_coords: result.flatMap(el => el.points),
			edges_vertices: result.map((_, i) => [i * 2, i * 2 + 1]),
		});
	} catch (error) {
		console.error(error);
	}
};

/**
 *
 */
export const foldedSegment = (pointA, pointB) => {
	// todo need to expose these options to the user
	const newAssignment = "F";
	const newFoldAngle = 0;

	const segment = [pointA, pointB];
	const folded = get(FoldedForm);
	const cp = get(CreasePattern);
	const {
		vertices_coords,
		vertices_overlapInfo,
		edges_vertices,
		collinear_edges,
	} = splitSegmentWithGraph(folded, segment);
	const edges_assignment = edges_vertices.map(() => newAssignment);
	const edges_foldAngle = edges_vertices.map(() => newFoldAngle);

	// splitSegmentWithGraph created new points in the foldedForm coordinate
	// space. we need to transfer these to their respective position in the
	// crease pattern space. 2 different methods depending on how the point was made
	vertices_overlapInfo.forEach((overlapInfo, v) => {
		if (overlapInfo.face !== undefined) {
			vertices_coords[v] = transferPointBetweenGraphs(
				folded,
				cp,
				overlapInfo.face,
				overlapInfo.point,
			);
		}
		if (overlapInfo.edge !== undefined) {
			vertices_coords[v] = transferPointOnEdgeBetweenGraphs(
				folded,
				cp,
				overlapInfo.edge,
				overlapInfo.a,
			);
		}
	});

	cp.vertices_coords = mergeArraysWithHoles(cp.vertices_coords, vertices_coords);
	cp.edges_vertices = mergeArraysWithHoles(cp.edges_vertices, edges_vertices);
	cp.edges_assignment = mergeArraysWithHoles(cp.edges_assignment, edges_assignment);
	cp.edges_foldAngle = mergeArraysWithHoles(cp.edges_foldAngle, edges_foldAngle);

	// this should be a bit smarter. if the user is creasing M/Vs, we need to
	// set M/V if the existing assignment is "F" or "U".
	// if we are creasing "F", this should be commented out.
	// collinear_edges.forEach(e => cp.edges_assignment[e] = newAssignment);
	// collinear_edges.forEach(e => cp.edges_foldAngle[e] = newFoldAngle);
	UpdateFrame({ ...cp });
};
