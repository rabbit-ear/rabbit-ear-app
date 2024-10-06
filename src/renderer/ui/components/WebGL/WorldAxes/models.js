import { createProgram } from "rabbit-ear/webgl/general/webgl.js";
import simple_100_vert from "./shaders/simple-100.vert?raw";
import simple_100_frag from "./shaders/simple-100.frag?raw";
import { makeUniforms } from "./uniforms.js";

const makeAxesLinesVertexData = () => {
  return new Float32Array([1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1]);
};

/**
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl WebGL context
 * @param {object} program
 * @returns {WebGLVertexArray[]}
 */
const makeVertexArrays = (gl, program) => [
  {
    location: gl.getAttribLocation(program, "v_position"),
    buffer: gl.createBuffer(),
    type: gl.FLOAT,
    length: 3,
    data: makeAxesLinesVertexData(),
  },
];

/**
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl WebGL context
 * @returns {WebGLElementArray[]}
 */
const makeElementArrays = (gl) => [
  {
    mode: gl.LINES,
    buffer: gl.createBuffer(),
    data: new Uint32Array([0, 1, 2, 3, 4, 5]),
  },
];

/**
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl The WebGL Context.
 * @returns {WebGLModel}
 */
export const worldAxesV1 = (gl) => {
  const program = createProgram(gl, simple_100_vert, simple_100_frag);
  return {
    program,
    vertexArrays: makeVertexArrays(gl, program),
    elementArrays: makeElementArrays(gl),
    flags: [], // flags: [gl.DEPTH_TEST],
    makeUniforms,
  };
};

/**
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl The WebGL Context.
 * @param {number} version the version of the WebGL
 * @returns {WebGLModel[]}
 */
export const worldAxes = (gl, version = 1) => {
  switch (version) {
    case 1:
      return [worldAxesV1(gl)];
    default:
      return [worldAxesV1(gl)];
  }
};
