/**
 * Created by amandaghassaei on 2/25/17.
 */
import type { FOLDMesh } from "../types.ts";
import remapField from "./remapField.ts";
import { makeVerticesVertices } from "./adjacentVertices.ts";

// v2 is center vertex
function mergeEdge(fold: FOLDMesh, v1: number, v2: number, v3: number): boolean {
  if (!fold.vertices_vertices) {
    return false;
  }
  let angleAvg = 0;
  let avgSum = 0;
  const angles: number[] = [];
  let edgeAssignment: string | null = null;
  const edgeIndices: number[] = [];

  for (let i = fold.edges_vertices.length - 1; i >= 0; i -= 1) {
    const edge = fold.edges_vertices[i];
    if (edge.indexOf(v2) >= 0 && (edge.indexOf(v1) >= 0 || edge.indexOf(v3) >= 0)) {
      if (edgeAssignment === null) edgeAssignment = fold.edges_assignment[i];
      else if (edgeAssignment !== fold.edges_assignment[i]) {
        console.warn("different edge assignments");
        return false;
      }
      const angle = fold.edges_foldAngle[i];
      if (Number.isNaN(angle)) console.log(i);
      angles.push(angle);
      if (angle) {
        angleAvg += angle;
        avgSum += 1;
      }
      edgeIndices.push(i); // larger index in front
    }
  }

  if (angles[0] !== angles[1]) {
    console.warn(`incompatible angles: ${JSON.stringify(angles)}`);
  }

  for (let i = 0; i < edgeIndices.length; i += 1) {
    const index = edgeIndices[i];
    fold.edges_vertices.splice(index, 1);
    fold.edges_assignment.splice(index, 1);
    fold.edges_foldAngle.splice(index, 1);
  }

  fold.edges_vertices.push([v1, v3]);
  fold.edges_assignment.push(edgeAssignment);
  if (avgSum > 0) fold.edges_foldAngle.push(angleAvg / avgSum);
  else fold.edges_foldAngle.push(null);
  let index = fold.vertices_vertices[v1].indexOf(v2);
  fold.vertices_vertices[v1].splice(index, 1);
  fold.vertices_vertices[v1].push(v3);
  index = fold.vertices_vertices[v3].indexOf(v2);
  fold.vertices_vertices[v3].splice(index, 1);
  fold.vertices_vertices[v3].push(v1);
  return true;
}

// the FOLD parameter should have vertices_vertices
function removeRedundantVertices(fold: FOLDMesh, epsilon: number = 1e-4) {
  if (!fold.vertices_vertices) {
    fold.vertices_vertices = makeVerticesVertices(fold);
  }
  const old2new: (number | null)[] = [];
  let numRedundant = 0;
  let newIndex = 0;

  for (let i = 0; i < fold.vertices_vertices.length; i += 1) {
    const vertex_vertices = fold.vertices_vertices[i];
    if (vertex_vertices.length !== 2) {
      old2new.push(newIndex++);
      continue;
    }

    const vertex_coord = fold.vertices_coords[i];
    const neighbor0 = fold.vertices_coords[vertex_vertices[0]];
    const neighbor1 = fold.vertices_coords[vertex_vertices[1]];
    const threeD = vertex_coord.length === 3;
    const vec0 = [neighbor0[0] - vertex_coord[0], neighbor0[1] - vertex_coord[1]];
    const vec1 = [neighbor1[0] - vertex_coord[0], neighbor1[1] - vertex_coord[1]];
    let magSqVec0 = vec0[0] * vec0[0] + vec0[1] * vec0[1];
    let magSqVec1 = vec1[0] * vec1[0] + vec1[1] * vec1[1];
    let dot = vec0[0] * vec1[0] + vec0[1] * vec1[1];

    if (threeD) {
      vec0.push(neighbor0[2] - vertex_coord[2]);
      vec1.push(neighbor1[2] - vertex_coord[2]);
      magSqVec0 += vec0[2] * vec0[2];
      magSqVec1 += vec1[2] * vec1[2];
      dot += vec0[2] * vec1[2];
    }

    dot /= Math.sqrt(magSqVec0 * magSqVec1);

    if (Math.abs(dot + 1.0) < epsilon) {
      const merged = mergeEdge(fold, vertex_vertices[0], i, vertex_vertices[1]);
      if (merged) {
        numRedundant += 1;
        old2new.push(null);
      } else {
        old2new.push(newIndex++);
        continue;
      }
    } else old2new.push(newIndex++);
  }

  if (numRedundant === 0) {
    return fold;
  }
  console.warn(`${numRedundant} redundant vertices found`);
  fold = remapField(fold, "vertices", old2new);

  if (fold.faces_vertices) {
    for (let i = 0; i < fold.faces_vertices.length; i += 1) {
      const face = fold.faces_vertices[i];
      for (let j = face.length - 1; j >= 0; j -= 1) {
        if (face[j] === null) face.splice(j, 1);
      }
    }
  }
  return fold;
}

export default removeRedundantVertices;
