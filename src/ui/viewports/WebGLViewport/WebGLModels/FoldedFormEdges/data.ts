/**
 * Rabbit Ear (c) Kraft
 */
import { makeEdgesVector } from "rabbit-ear/graph/make/edges.js";
import type { FOLD } from "rabbit-ear/types.js";
import { light, dark } from "rabbit-ear/webgl/general/colors.js";

/**
 * @param {FOLD} graph a FOLD object
 * @param {{ assignment_color?: any, dark: boolean }} options
 * @returns {{
 *   vertices_coords: any,
 *   vertices_color: any,
 *   verticesEdgesVector: any,
 *   vertices_vector: any,
 * } | undefined}
 */
export const makeThickEdgesVertexData = (
  graph: FOLD,
  options: { assignment_color: object, dark: boolean },
) => {
  if (!graph || !graph.vertices_coords || !graph.edges_vertices) {
    return undefined;
  }
  const assignmentColors = options && options.dark ? dark : light;
  const assignment_color = {
    ...assignmentColors,
    ...options,
  };
  const vertices_coords3D = graph.vertices_coords.map((coord) =>
    [...coord].concat(Array(3 - coord.length).fill(0)),
  );
  const vertices_coords = graph.edges_vertices
    .flatMap((edge) => edge.map((v) => vertices_coords3D[v]))
    .flatMap((coord) => [coord, coord, coord, coord]);
  const edgesVector = makeEdgesVector(graph);
  const vertices_color = graph.edges_assignment
    ? graph.edges_assignment.flatMap((a) => Array(8).fill(assignment_color[a]))
    : graph.edges_vertices.flatMap(() => Array(8).fill(assignment_color.U));
  const verticesEdgesVector = edgesVector.flatMap((el) => [
    el,
    el,
    el,
    el,
    el,
    el,
    el,
    el,
  ]);
  const vertices_vector = graph.edges_vertices.flatMap(() => [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],

    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ]);
  return {
    vertices_coords,
    vertices_color,
    verticesEdgesVector,
    vertices_vector,
  };
};
