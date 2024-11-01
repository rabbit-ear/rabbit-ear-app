/**
 * Created by amandaghassaei on 2/25/17.
 */
import type { FOLDMesh } from "../types.ts";
import earcut from "earcut";
/**
 * @description distance squared between two points, 2D or 3D
 */
const distSq = (a, b) => {
  const vector = [b[0] - a[0], b[1] - a[1], (b[2] || 0) - (a[2] || 0)];
  return vector[0] ** 2 + vector[1] ** 2 + vector[2] ** 2;
};
/**
 * @description Triangulate faces inside a FOLD graph. This will
 * modify the input parameter.
 * @param {object} fold a FOLD object
 * @param {boolean} is2d are all vertices in the graph 2D?
 * @returns {number[]} an array matching the length of the new
 * faces, with index:value mapping indices between newFace:oldFace.
 */
const triangulatedFOLD = (fold: FOLDMesh, is2d: boolean = true): number[] => {
  // as this loop encounters faces which need to be subdivided,
  // new join edges will be added inside the loop.
  // new faces_vertices will be made here, and set at the end.
  const triangulated_vertices = [];

  // we will have (potentially) new faces- what was the original
  // face index that each face came from?
  const faces_backmap = [];

  for (let i = 0; i < fold.faces_vertices.length; i += 1) {
    const face = fold.faces_vertices[i];

    // face is already a triangle
    if (face.length === 3) {
      triangulated_vertices.push(face);
      faces_backmap.push(i);
      continue;
    }

    // face is a quad, manually triangulate.
    if (face.length === 4) {
      const pts = face.map((f) => fold.vertices_coords[f]);
      // which diagonal is shorter? true: 0-2, false: 1-3
      const shorter = distSq(pts[0], pts[2]) < distSq(pts[1], pts[3]);
      const e_v = shorter ? [0, 2] : [1, 3];
      const f_v = shorter
        ? [
          [0, 1, 2],
          [0, 2, 3],
        ]
        : [
          [0, 1, 3],
          [1, 2, 3],
        ];
      fold.edges_vertices.push(e_v.map((j) => face[j]));
      triangulated_vertices.push(...f_v.map((f) => f.map((j) => face[j])));
      fold.edges_foldAngle.push(0);
      fold.edges_assignment.push("J");
      faces_backmap.push(i, i);
      continue;
    }
    // if the face is not a triangle or a quad, use the earcut library
    const faceEdges = [];
    for (let j = 0; j < fold.edges_vertices.length; j += 1) {
      const edge = fold.edges_vertices[j];
      if (face.indexOf(edge[0]) >= 0 && face.indexOf(edge[1]) >= 0) {
        faceEdges.push(j);
      }
    }
    // create a flat array of all the vertices in this face
    const dim = is2d ? [0, 1] : [0, 1, 2];
    const faceVert = fold.faces_vertices[i].flatMap((v) =>
      dim.map((d) => fold.vertices_coords[v][d]),
    );
    // triangulate
    const triangles = earcut(faceVert, null, is2d ? 2 : 3);

    for (let j = 0; j < triangles.length; j += 3) {
      const tri = [face[triangles[j + 1]], face[triangles[j + 2]], face[triangles[j]]];
      const foundEdges = [false, false, false]; // ab, bc, ca

      for (let k = 0; k < faceEdges.length; k += 1) {
        const edge = fold.edges_vertices[faceEdges[k]];

        const aIndex = edge.indexOf(tri[0]);
        const bIndex = edge.indexOf(tri[1]);
        const cIndex = edge.indexOf(tri[2]);

        if (aIndex >= 0) {
          if (bIndex >= 0) {
            foundEdges[0] = true;
            continue;
          }
          if (cIndex >= 0) {
            foundEdges[2] = true;
            continue;
          }
        }
        if (bIndex >= 0) {
          if (cIndex >= 0) {
            foundEdges[1] = true;
            continue;
          }
        }
      }

      for (let k = 0; k < 3; k += 1) {
        if (foundEdges[k]) continue;
        if (k === 0) {
          faceEdges.push(fold.edges_vertices.length);
          fold.edges_vertices.push([tri[0], tri[1]]);
          fold.edges_foldAngle.push(0);
          fold.edges_assignment.push("J");
        } else if (k === 1) {
          faceEdges.push(fold.edges_vertices.length);
          fold.edges_vertices.push([tri[2], tri[1]]);
          fold.edges_foldAngle.push(0);
          fold.edges_assignment.push("J");
        } else if (k === 2) {
          faceEdges.push(fold.edges_vertices.length);
          fold.edges_vertices.push([tri[2], tri[0]]);
          fold.edges_foldAngle.push(0);
          fold.edges_assignment.push("J");
        }
      }
      triangulated_vertices.push(tri);
      faces_backmap.push(i);
    }
  }
  fold.faces_vertices = triangulated_vertices;
  return faces_backmap;
};

export default triangulatedFOLD;
