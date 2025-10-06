export const makeVertexArrays = (
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  program: WebGLProgram) => [
    {
      location: gl.getAttribLocation(program, "v_position"),
      buffer: gl.createBuffer(),
      type: gl.FLOAT,
      length: 2,
      data: new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    },
  ];

export const makeElementArrays = (gl: WebGLRenderingContext | WebGL2RenderingContext) => [
  {
    mode: gl.TRIANGLE_STRIP,
    buffer: gl.createBuffer(),
    data: new Uint32Array([0, 1, 2, 3]),
  },
];


