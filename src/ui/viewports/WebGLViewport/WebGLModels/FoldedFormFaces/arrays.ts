/**
 * Rabbit Ear (c) Kraft
 */
import { makeFacesVertexData } from "./data.js";
import { makeFacesEdgesFromVertices } from "rabbit-ear/graph/make/facesEdges.js";

/**
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl WebGL context
 * @param {object} program
 * @param {FOLDExtended} graph a FOLD object
 * @param {{ showTriangulation?: boolean }} options
 * @returns {WebGLVertexArray[]}
 */
export const makeFoldedVertexArrays = (
  gl,
  program,
  {
    vertices_coords,
    edges_vertices,
    edges_assignment,
    faces_vertices,
    faces_edges,
    faces_normal,
  } = {},
  options = {},
) => {
  if (!vertices_coords || !faces_vertices) {
    return [];
  }
  if (!faces_edges && edges_vertices && faces_vertices) {
    faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
  }
  const {
    vertices_coords: vertices_coords3,
    vertices_normal,
    vertices_barycentric,
  } = makeFacesVertexData(
    {
      vertices_coords,
      edges_assignment,
      faces_vertices,
      faces_edges,
      faces_normal,
    },
    options,
  );
  return [
    {
      location: gl.getAttribLocation(program, "v_position"),
      buffer: gl.createBuffer(),
      type: gl.FLOAT,
      length: vertices_coords3.length ? vertices_coords3[0].length : 3,
      data: new Float32Array(vertices_coords3.flat()),
    },
    {
      location: gl.getAttribLocation(program, "v_normal"),
      buffer: gl.createBuffer(),
      type: gl.FLOAT,
      length: vertices_normal.length ? vertices_normal[0].length : 3,
      data: new Float32Array(vertices_normal.flat()),
    },
    {
      location: gl.getAttribLocation(program, "v_barycentric"),
      buffer: gl.createBuffer(),
      type: gl.FLOAT,
      length: 3,
      data: new Float32Array(vertices_barycentric.flat()),
    },
    // { location: gl.getAttribLocation(program, "v_rawEdge"),
    // 	buffer: gl.createBuffer(),
    // 	type: gl.FLOAT,
    // 	// type: gl.INT,
    // 	// type: gl.UNSIGNED_BYTE,
    // 	length: 1,
    // 	data: new Float32Array(rawEdges.flat()) },
  ].filter((el) => el.location !== -1);
};

/**
 * WebGL 2 can handle Uint32Array. WebGL 1 cannot and must use 16 bit.
 */

/**
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl WebGL context
 * @param {number} version the WebGL version
 * @param {FOLD} graph a FOLD object
 * @returns {WebGLElementArray[]}
 */
export const makeFoldedElementArrays = (gl, version = 1, graph = {}) => {
  if (!graph || !graph.vertices_coords || !graph.faces_vertices) {
    return [];
  }
  return [
    {
      mode: gl.TRIANGLES,
      buffer: gl.createBuffer(),
      data:
        version === 2
          ? new Uint32Array(graph.faces_vertices.flat())
          : new Uint16Array(graph.faces_vertices.flat()),
    },
  ];
};

