import type { FOLDMesh } from "../types.ts";

// no "cut" assignment. all cuts have now been turned into boundaries
const assignments = Array.from("BMVFJU");

export const makeTypedArrays = (
  fold: FOLDMesh,
): {
  positions: Float32Array;
  colors: Float32Array;
  indices: Uint16Array;
  lineIndices: { [key: string]: Uint16Array };
} => {
  const positions = new Float32Array(fold.vertices_coords.length * 3);
  const colors = new Float32Array(fold.vertices_coords.length * 3);
  const indices = new Uint16Array(fold.faces_vertices.length * 3);

  // keys are assignments (M, V ...), values are Uint16Array
  const lineIndices: { [key: string]: Uint16Array } = {};

  for (let i = 0; i < fold.vertices_coords.length; i += 1) {
    positions[3 * i] = fold.vertices_coords[i][0];
    positions[3 * i + 1] = fold.vertices_coords[i][1];
    positions[3 * i + 2] = fold.vertices_coords[i][2];
  }

  for (let i = 0; i < fold.faces_vertices.length; i += 1) {
    indices[3 * i] = fold.faces_vertices[i][0];
    indices[3 * i + 1] = fold.faces_vertices[i][1];
    indices[3 * i + 2] = fold.faces_vertices[i][2];
  }

  // each key is an assignment type: M, V ... the values are arrays
  // each array is a stride-2 of vertices where each pair describes
  // an edge, like [2, 5, 9, 5, ...] meaning edge between 2 & 5, 9 & 5...
  const assignmentEdgeVertices: { [key: string]: number[] } = {};

  assignments.forEach((key) => {
    assignmentEdgeVertices[key] = [];
  });

  fold.edges_assignment
    .map((assignment) => assignment.toUpperCase())
    .forEach((assignment, i) => {
      assignmentEdgeVertices[assignment].push(fold.edges_vertices[i][0]);
      assignmentEdgeVertices[assignment].push(fold.edges_vertices[i][1]);
    });

  // todo, do we need to release memory from last time?
  assignments.forEach((key) => {
    lineIndices[key] = new Uint16Array(assignmentEdgeVertices[key].length);
    for (let i = 0; i < assignmentEdgeVertices[key].length; i += 1) {
      lineIndices[key][i] = assignmentEdgeVertices[key][i];
    }
  });

  return {
    positions,
    colors,
    indices,
    lineIndices,
  };
};
