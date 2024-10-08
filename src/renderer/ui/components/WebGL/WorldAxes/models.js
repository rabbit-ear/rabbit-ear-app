import { createProgram } from "rabbit-ear/webgl/general/webgl.js";
import simple_100_vert from "./shaders/simple-100.vert?raw";
import simple_100_frag from "./shaders/simple-100.frag?raw";
import { makeUniforms } from "./uniforms.js";

const makeAxesLinesVertexData = () => {
  return new Float32Array([1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1]);
};

const makeVertexArrays = (gl, program) => [
  {
    location: gl.getAttribLocation(program, "v_position"),
    buffer: gl.createBuffer(),
    type: gl.FLOAT,
    length: 3,
    data: makeAxesLinesVertexData(),
  },
];

const makeElementArrays = (gl) => [
  {
    mode: gl.LINES,
    buffer: gl.createBuffer(),
    data: new Uint32Array([0, 1, 2, 3, 4, 5]),
  },
];

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

export const worldAxes = (gl, version = 1) => {
  switch (version) {
    case 1:
      return [worldAxesV1(gl)];
    default:
      return [worldAxesV1(gl)];
  }
};
