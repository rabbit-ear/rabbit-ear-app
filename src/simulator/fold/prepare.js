/**
 * Created by amandaghassaei on 2/25/17.
 */
import triangulateFold from "./triangulateFold.js";
import splitCuts from "./splitCuts.js";
import removeRedundantVertices from "./removeRedundantVertices.js";
import boundingBox from "./boundingBox.js";
import {
	makeVerticesEdges,
	makeVerticesVertices,
} from "./adjacentVertices.js";
/**
 * @description convert the indices to values and values to indices,
 * grouping multiple results into an array
 */
const invertMap = (map) => {
	const invert = [];
	map.forEach(value => { invert[value] = []; });
	map.forEach((value, i) => { invert[value].push(i); });
	return invert;
};
/**
 * @description the relative fold angle in degrees for
 * all assignments that have a fold angle that is not 0.
 */
const assignmentFlatAngles = {
	M: -180, m: -180, V: 180, v: 180,
};
/**
 * @description make an edges_foldAngle array from a FOLD object
 * by referencing the edges_assignment. This results will assume
 * the mountain and valleys are flat-folded 180 degrees.
 */
const makeEdgesFoldAngle = ({ edges_assignment }) => edges_assignment
	.map(a => assignmentFlatAngles[a] || 0);
/**
 * @description prepare a FOLD object for the GPU, returning a copy.
 * (does not modify the input object)
 * - ensure vertices are 3D (converts 2D into 3D by setting z axis to 0)
 * - triangulate faces (changes # of faces, edges)
 * - turn each cut edge "C" into two boundary "B" edges.
 *
 * "epsilon" is used only for cutting "C" edges.
 *
 * This was refactored from globals.pattern.setFoldData, where the
 * second optional parameter was also used to run "returnCreaseParams".
 * This is changed, now model/index calls "returnCreaseParams" directly.
 */
const prepare = (inputFOLD, epsilon) => {
	// these fields are absolutely necessary
	if (!inputFOLD.vertices_coords || !inputFOLD.edges_vertices) {
		throw new Error("model must contain vertices_coords and edges_vertices");
	}
	// deep copy input object
	let fold = JSON.parse(JSON.stringify(inputFOLD));

	// ensure fields exist
	if (!fold.faces_vertices) { fold.faces_vertices = []; }

	// one of these two fields is absolutely necessary.
	// if neither exist, set all creases to unassigned "U".
	if (!fold.edges_assignment && !fold.edges_foldAngle) {
		fold.edges_assignment = fold.edges_vertices.map(() => "U");
	}

	// we need edges_foldAngle, but we can infer it from edges_assignment
	// if edges_foldAngle does not exist, set it from edges_assignment
	if (fold.edges_assignment && !fold.edges_foldAngle) {
		fold.edges_foldAngle = makeEdgesFoldAngle(fold);
	}

	// make all edges_assignments uppercase
	fold.edges_assignment = fold.edges_assignment.map(a => a.toUpperCase());

	// find a nice epsilon for vertex merging, unless the user specified one.
	if (epsilon === undefined) {
		const box = boundingBox(fold);
		epsilon = 1e-4 * (box ? Math.max(...box.span) : 1);
	}

	// make 3d in the X-Y plane
	for (let i = 0; i < fold.vertices_coords.length; i += 1) {
		const vertex = fold.vertices_coords[i];
		if (vertex.length === 2) {
			fold.vertices_coords[i] = [vertex[0], vertex[1], 0];
		}
	}

	// get the indices of every cut "C" edge.
	const cut_edge_indices = fold.edges_assignment
		.map((assign, i) => (assign === "C" ? i : undefined))
		.filter(a => a !== undefined);

	// if cut creases exist, convert them into boundaries
	// this may change the number of vertices and edges, but not faces
	if (cut_edge_indices.length > 0) {
		if (!fold.vertices_vertices) {
			fold.vertices_vertices = makeVerticesVertices(fold);
		}
		fold.vertices_edges = makeVerticesEdges(fold);
		fold = splitCuts(fold);
		// removeRedundantVertices requires vertices_vertices
		fold.vertices_vertices = makeVerticesVertices(fold);
		// remove vertices that split edge
		fold = removeRedundantVertices(fold, epsilon);
	}
	delete fold.vertices_vertices;
	delete fold.vertices_edges;
	// this may change the number of edges and faces, but not vertices
	const faces_backmap = triangulateFold(fold, true);
	// store a reference, for every face (new triangulated faces),
	// which face index from the original set did this face arise from?
	fold.faces_backmap = faces_backmap;
	fold.faces_nextmap = invertMap(faces_backmap);
	return fold;
};

export default prepare;
