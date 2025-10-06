/**
 * Rabbit Ear (c) Kraft
 */
import { makeVerticesNormal } from "rabbit-ear/graph/normals.js";
import { resize3 } from "rabbit-ear/math/vector.js";

const getFaceEdgeIsJoined = ({ edges_assignment, faces_vertices, faces_edges }) => {
  if (faces_edges && edges_assignment) {
    return faces_edges.map((edges) =>
      edges.map((e) => edges_assignment[e]).map((a) => a === "J" || a === "j"),
    );
  }
  return faces_vertices ? faces_vertices.map((arr) => arr.map(() => false)) : [];
};

/**
 * @param {FOLDExtended} graph a FOLD object
 * @param {{ showTriangulation?: boolean }} options
 * @returns {{
 *   vertices_coords: [number, number][]|[number, number, number][],
 *   vertices_normal: number[][],
 *   vertices_barycentric: [number, number, number][],
 * }}
 */
export const makeFacesVertexData = (
  { vertices_coords, edges_assignment, faces_vertices, faces_edges, faces_normal },
  options = {},
) => {
  const vertices_coords3 = vertices_coords
    .map((coord) => [...coord].concat(Array(3 - coord.length).fill(0)))
    .map(resize3);
  const vertices_normal = makeVerticesNormal({
    vertices_coords: vertices_coords3,
    faces_vertices,
    faces_normal,
  });
  /** @type {[number, number, number][]} */
  const vertices_barycentric = vertices_coords3
    .map((_, i) => i % 3)
    .map((n) => [n === 0 ? 1 : 0, n === 1 ? 1 : 0, n === 2 ? 1 : 0]);
  // const rawEdges = faces_rawEdge.flatMap(n => [n, n, n]);
  const facesEdgesIsJoined = getFaceEdgeIsJoined({
    edges_assignment,
    faces_vertices,
    faces_edges,
  });
  if (!options.showTriangulation && vertices_barycentric.length >= facesEdgesIsJoined.length) {
    for (let i = 0; i < facesEdgesIsJoined.length; i += 1) {
      if (facesEdgesIsJoined[i][0]) {
        vertices_barycentric[i * 3 + 0][2] = vertices_barycentric[i * 3 + 1][2] = 100;
      }
      if (facesEdgesIsJoined[i][1]) {
        vertices_barycentric[i * 3 + 1][0] = vertices_barycentric[i * 3 + 2][0] = 100;
      }
      if (facesEdgesIsJoined[i][2]) {
        vertices_barycentric[i * 3 + 0][1] = vertices_barycentric[i * 3 + 2][1] = 100;
      }
    }
  }
  return {
    vertices_coords: vertices_coords3,
    vertices_normal,
    vertices_barycentric,
  };
};

