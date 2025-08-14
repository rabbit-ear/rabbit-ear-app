/**
 * Rabbit Ear (c) Kraft
 */
import { makeThickEdgesVertexData } from "./data.js";

// thick edges

/**
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl WebGL context
 * @param {object} program
 * @param {FOLD} graph a FOLD object
 * @param {{ assignment_color?: any }} options
 * @returns {WebGLVertexArray[]}
 */
export const makeThickEdgesVertexArrays = (gl, program, graph, options = {}) => {
  if (!graph || !graph.vertices_coords || !graph.edges_vertices) {
    return [];
  }
  const { vertices_coords, vertices_color, verticesEdgesVector, vertices_vector } =
    makeThickEdgesVertexData(graph, options.assignment_color);

  // todo: better
  if (!vertices_coords) {
    return [];
  }

  return [
    {
      location: gl.getAttribLocation(program, "v_position"),
      buffer: gl.createBuffer(),
      type: gl.FLOAT,
      length: vertices_coords.length ? vertices_coords[0].length : 3,
      data: new Float32Array(vertices_coords.flat()),
    },
    {
      location: gl.getAttribLocation(program, "v_color"),
      buffer: gl.createBuffer(),
      type: gl.FLOAT,
      length: vertices_color.length ? vertices_color[0].length : 3,
      data: new Float32Array(vertices_color.flat()),
    },
    {
      location: gl.getAttribLocation(program, "edge_vector"),
      buffer: gl.createBuffer(),
      type: gl.FLOAT,
      length: verticesEdgesVector.length ? verticesEdgesVector[0].length : 3,
      data: new Float32Array(verticesEdgesVector.flat()),
    },
    {
      location: gl.getAttribLocation(program, "vertex_vector"),
      buffer: gl.createBuffer(),
      type: gl.FLOAT,
      length: vertices_vector.length ? vertices_vector[0].length : 3,
      data: new Float32Array(vertices_vector.flat()),
    },
  ].filter((el) => el.location !== -1);
};

/**
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl WebGL context
 * @param {number} version the WebGL version
 * @param {FOLD} graph a FOLD object
 * @returns {WebGLElementArray[]}
 */
export const makeThickEdgesElementArrays = (gl, version = 1, graph = {}) => {
  if (!graph || !graph.edges_vertices) {
    return [];
  }
  const edgesTriangles = graph.edges_vertices
    .map((_, i) => i * 8)
    .flatMap((i) => [
      i + 0,
      i + 1,
      i + 4,
      i + 4,
      i + 1,
      i + 5,
      i + 1,
      i + 2,
      i + 5,
      i + 5,
      i + 2,
      i + 6,
      i + 2,
      i + 3,
      i + 6,
      i + 6,
      i + 3,
      i + 7,
      i + 3,
      i + 0,
      i + 7,
      i + 7,
      i + 0,
      i + 4,
    ]);
  return [
    {
      mode: gl.TRIANGLES,
      buffer: gl.createBuffer(),
      data:
        version === 2 ? new Uint32Array(edgesTriangles) : new Uint16Array(edgesTriangles),
    },
  ];
};
