/**
 * Rabbit Ear (c) Kraft
 */
import { triangulateConvexFacesVertices } from "rabbit-ear/graph/triangulate.js";
import { resize2 } from "rabbit-ear/math/vector.js";

/**
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl WebGL context
 * @param {object} program
 * @param {FOLD} graph a FOLD object
 * @returns {WebGLVertexArray[]}
 */
export const makeCPFacesVertexArrays = (gl, program, graph) => {
  if (!graph || !graph.vertices_coords) {
    return [];
  }
  return [
    {
      location: gl.getAttribLocation(program, "v_position"),
      buffer: gl.createBuffer(),
      type: gl.FLOAT,
      length: 2,
      data: new Float32Array(graph.vertices_coords.flatMap(resize2)),
    },
  ].filter((el) => el.location !== -1);
};

/**
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl WebGL context
 * @param {number} version the WebGL version
 * @param {FOLD} graph a FOLD object
 * @returns {WebGLElementArray[]}
 */
export const makeCPFacesElementArrays = (gl, version = 1, graph = {}) => {
  if (!graph || !graph.vertices_coords || !graph.faces_vertices) {
    return [];
  }
  return [
    {
      mode: gl.TRIANGLES,
      buffer: gl.createBuffer(),
      data:
        version === 2
          ? new Uint32Array(triangulateConvexFacesVertices(graph).flat())
          : new Uint16Array(triangulateConvexFacesVertices(graph).flat()),
    },
  ];
};
