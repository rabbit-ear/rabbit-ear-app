/**
 * Rabbit Ear (c) Kraft
 */
import { createProgram } from "../general/webgl.js";
import {
  makeCPEdgesVertexArrays,
  makeCPEdgesElementArrays,
} from "./arrays.js";
import { makeUniforms } from "./uniforms.js";
import {
  thick_edges_100_vert,
  thick_edges_100_frag,
  thick_edges_300_vert,
  thick_edges_300_frag,
} from "./shaders.js";

/**
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl The WebGL Context.
 * @param {FOLD} graph a FOLD object
 * @param {object} options
 * @returns {WebGLModel}
 */
export const cpEdgesV1 = (gl, graph = {}, options = undefined) => {
  const program = createProgram(gl, thick_edges_100_vert, thick_edges_100_frag);
  return {
    program,
    vertexArrays: makeCPEdgesVertexArrays(gl, program, graph, options),
    elementArrays: makeCPEdgesElementArrays(gl, 1, graph),
    flags: [],
    makeUniforms,
  };
};

/**
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl The WebGL Context.
 * @param {FOLD} graph a FOLD object
 * @param {object} options
 * @returns {WebGLModel}
 */
export const cpEdgesV2 = (gl, graph = {}, options = undefined) => {
  const program = createProgram(gl, thick_edges_300_vert, thick_edges_300_frag);
  return {
    program,
    vertexArrays: makeCPEdgesVertexArrays(gl, program, graph, options),
    elementArrays: makeCPEdgesElementArrays(gl, 2, graph),
    flags: [],
    makeUniforms,
  };
};

