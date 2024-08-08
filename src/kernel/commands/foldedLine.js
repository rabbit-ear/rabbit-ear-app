import { get } from "svelte/store";
import { UpdateFrame } from "../../stores/Model.js";
import { CreasePattern } from "../../stores/ModelCP.js";
import {
	FoldedForm,
	// ComputedFoldedCoords,
} from "../../stores/ModelFolded.js";
import { simpleFoldSegment } from "rabbit-ear/graph/fold/simpleFold.js";
import { foldGraphIntoSegments } from "rabbit-ear/graph/fold/foldGraphIntoSegments.js";
import { subtract2 } from "rabbit-ear/math/vector.js";
import { pointsToLine } from "rabbit-ear/math/convert.js";
import { edgeAssignmentToFoldAngle } from "rabbit-ear/fold/spec.js";
import { GhostGraphCP } from "../../stores/UI.js";
import {
	NewEdgeAssignment,
	// NewEdgeFoldAngle,
} from "../../stores/App.js";
import { validate } from "rabbit-ear/graph/validate/validate.js";
import { mergeArraysWithHoles } from "rabbit-ear/general/array.js";
import {
	transferPointInFaceBetweenGraphs,
	// transferPointOnEdgeBetweenGraphs,
} from "rabbit-ear/graph/transfer.js";

export const foldedLine = (a, b) => {
	const line = { vector: subtract2(b, a), origin: a };
	try {
		const graph = get(CreasePattern);
		const result = foldGraphIntoSegments(graph, line, "V").filter((a) => a !== undefined);
		const vertCount = graph.vertices_coords.length;
		graph.vertices_coords.push(...result.flatMap((el) => el.points));
		graph.edges_vertices.push(
			...result.map((_, i) => [vertCount + i * 2, vertCount + i * 2 + 1]),
		);
		graph.edges_assignment.push(...result.map((el) => el.assignment));
		graph.edges_foldAngle.push(
			...result.map((el) => el.assignment).map((a) => edgeAssignmentToFoldAngle(a)),
		);
		UpdateFrame({ ...graph });
	} catch (error) {
		console.error(error);
	}
};

// export const foldedLine = (a, b) => {
// 	// the face under the point's crease will get the assignment in the method
// 	// input parameter, and all other creases will be valley/mountain accordingly
// 	const startFace = faceContainingPoint(
// 		{ vertices_coords, faces_vertices },
// 		origin,
// 		vector,
// 	);

// 	// this assumes the model is flat folded.
// 	// another approach would be to check for any non-flat edges, fold a 3D
// 	// graph, then find all faces that are in the same plane as startFace.
// 	const vertices_coordsFolded = makeVerticesCoordsFlatFolded({
// 		vertices_coords,
// 		edges_vertices,
// 		edges_foldAngle,
// 		edges_assignment,
// 		faces_vertices,
// 		faces_faces,
// 	}, startFace);

// 	foldFoldedForm()
// }

export const foldedLinePreview = (a, b) => {
	const line = { vector: subtract2(b, a), origin: a };
	// return foldCreasePattern(get(CreasePattern), line, "V");
	try {
		const result = foldGraphIntoSegments(get(CreasePattern), line, "V").filter(
			(a) => a !== undefined,
		);
		// console.log("graph", {
		// 	vertices_coords: result.flatMap(el => el.points),
		// 	edges_vertices: result.map((_, i) => [i * 2, i * 2 + 1]),
		// });
		GhostGraphCP.set({
			vertices_coords: result.flatMap((el) => el.points),
			edges_vertices: result.map((_, i) => [i * 2, i * 2 + 1]),
			edges_assignment: result.map(() => "F"),
		});
	} catch (error) {
		console.error(error);
	}
};

export const foldedSegment = (pointA, pointB) => {
	//, assignment = "F", foldAngle = 0) => {
	const segment = [pointA, pointB];
	const folded = get(FoldedForm);
	// const cp = structuredClone(get(CreasePattern));
	const cp = get(CreasePattern);
	const assignment = get(NewEdgeAssignment);
	// const foldAngle = get(NewEdgeFoldAngle);
	const vertices_coordsFolded = folded.vertices_coords;
	const result = foldSegment(cp, segment, {
		assignment,
		vertices_coordsFolded,
	});
	// console.log("result", result);
	// console.log("cp", JSON.stringify(structuredClone(cp)));
	// console.log("folded", structuredClone(folded));

	// temp
	try {
		const v = validate(cp);
		if (v.length) {
			console.log("validate", v);
		}
	} catch (error) {
		console.log(cp);
		console.error("validate FAILED", error);
	}

	UpdateFrame(cp);
};

/**
 *
 */
// export const foldedSegment = (pointA, pointB) => {
// 	// todo need to expose these options to the user
// 	const newAssignment = "F";
// 	const newFoldAngle = 0;

// 	const segment = [pointA, pointB];
// 	const folded = get(FoldedForm);
// 	const cp = get(CreasePattern);
// 	const {
// 		vertices,
// 		edges_vertices,
// 		edges_collinear,
// 		edges_face,
// 	} = splitLineIntoEdges(
// 		folded,
// 		pointsToLine(...segment),
// 		includeS,
// 		segment,
// 	);

// 	const vertices_coords = vertices.map(el => el.point);

// 	const edges_assignment = edges_vertices.map(() => newAssignment);
// 	const edges_foldAngle = edges_vertices.map(() => newFoldAngle);

// 	// splitSegmentWithGraph created new points in the foldedForm coordinate
// 	// space. we need to transfer these to their respective position in the
// 	// crease pattern space. 2 different methods depending on how the point was made
// 	vertices.forEach((overlapInfo, v) => {
// 		if (overlapInfo.face !== undefined) {
// 			vertices_coords[v] = transferPointInFaceBetweenGraphs(
// 				folded,
// 				cp,
// 				overlapInfo.face,
// 				overlapInfo.point,
// 			);
// 		}
// 		if (overlapInfo.edge !== undefined) {
// 			vertices_coords[v] = transferPointOnEdgeBetweenGraphs(
// 				cp,
// 				overlapInfo.edge,
// 				overlapInfo.b,
// 			);
// 		}
// 	});

// 	cp.vertices_coords = mergeArraysWithHoles(cp.vertices_coords, vertices_coords);
// 	cp.edges_vertices = mergeArraysWithHoles(cp.edges_vertices, edges_vertices);
// 	cp.edges_assignment = mergeArraysWithHoles(cp.edges_assignment, edges_assignment);
// 	cp.edges_foldAngle = mergeArraysWithHoles(cp.edges_foldAngle, edges_foldAngle);

// 	// collinear edges should be dealt in this way:
// 	// if the edge is alredy a M or V, we can ignore it
// 	// if the edge is a F or U, we need to fold it, and we need to know which
// 	// direction, this is done by checking one of its two neighboring faces
// 	// (edges_faces), they should be the same winding, so just grab one.

// 	// const faces_winding = makeFacesWinding(folded);

// 	// const reassignable = { F: true, f: true, U: true, u: true };

// 	// edges_collinear
// 	// 	.map((collinear, e) => collinear ? e : undefined)
// 	// 	.filter(a => a !== undefined)
// 	// 	.forEach(edge => {
// 	// 		// if edge is F or U:
// 	// 		if (!reassignable[cp.edges_assignment[edge]]) { return; }
// 	// 		const face = cp.edges_faces[edge]
// 	// 			.filter(a => a !== undefined)
// 	// 			.shift();
// 	// 		const winding = faces_winding[face];
// 	// 		cp.edges_assignment[edge] = winding ? "M" : "V";
// 	// 	});

// 	UpdateFrame({ ...cp });
// };
