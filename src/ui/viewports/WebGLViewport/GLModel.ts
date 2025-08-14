import type { WebGLViewport } from "./WebGLViewport.svelte";

export type VertexArray = {
  location: GLint;
  buffer: WebGLBuffer;
  type: number;
  length: number;
  data: Float32Array;
};

export type ElementArray = {
  mode: GLint;
  buffer: WebGLBuffer;
  data: Uint16Array | Uint32Array;
};

export interface GLModel {
  viewport: WebGLViewport;

  // programOptions: { [key: string]: any };

  program: WebGLProgram | undefined;

  vertexArrays: VertexArray[];

  elementArrays: ElementArray[];

  // flags: [], // flags: [gl.DEPTH_TEST],
  flags: number[];

  // uniformInputs: { [key: string]: any };

  uniforms: { [key: string]: any };
}

export const drawGLModel = (
  gl: WebGLRenderingContext | WebGL2RenderingContext | undefined,
  version: number,
  model: GLModel) => {
  if (!gl || !model || !model.program) { return; }

  try {
    gl.useProgram(model.program);
  } catch (error) {
    console.warn("WE CAUGHT THE ERROR");
    console.log(error);
  }

  model.flags.forEach((flag) => gl.enable(flag));

  // set uniforms
  const uniformCount: number = gl.getProgramParameter(model.program, gl.ACTIVE_UNIFORMS);

  for (let i = 0; i < uniformCount; i += 1) {
    const uniformName = gl.getActiveUniform(model.program, i)?.name;
    if (!uniformName || !model.uniforms[uniformName]) {
      continue;
    }
    const { func, value } = model.uniforms[uniformName];
    const index = gl.getUniformLocation(model.program, uniformName);
    switch (func) {
      case "uniformMatrix2fv":
      case "uniformMatrix3fv":
      case "uniformMatrix4fv":
        gl[func]?.(index, false, value);
        break;
      // all other WebGLRenderingContext.uniform[1234][fi][v]()
      default:
        gl[func]?.(index, value);
        break;
    }
  }

  // set vertex arrays
  model.vertexArrays.forEach((el) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, el.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, el.data, gl.STATIC_DRAW);
    gl.vertexAttribPointer(el.location, el.length, el.type, false, 0, 0);
    gl.enableVertexAttribArray(el.location);
  });

  // gl.linkProgram(model.program);
  // draw elements
  // WebGL 2 supports UNSIGNED_INT (Uint32Array)
  // WebGL 1 cannot and must use UNSIGNED_SHORT (Uint16Array)
  model.elementArrays.forEach((el) => {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, el.buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, el.data, gl.STATIC_DRAW);
    gl.drawElements(
      el.mode, // GL.TRIANGLES for example
      el.data.length,
      version === 2 ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT,
      0, // offset
    );
  });

  model.flags.forEach((flag) => gl.disable(flag));
};

export const deallocModel = (
  gl: WebGLRenderingContext | WebGL2RenderingContext | undefined,
  model: GLModel) => {
  if (!gl || !model.program || !gl.isProgram(model.program)) { return; }
  model.vertexArrays.forEach((vert) => gl.disableVertexAttribArray(vert.location));
  model.vertexArrays.forEach((vert) => gl.deleteBuffer(vert.buffer));
  model.elementArrays.forEach((elements) => gl.deleteBuffer(elements.buffer));
  gl.deleteProgram(model.program);
  // gl.deleteTexture(someTexture);
  // gl.deleteRenderbuffer(someRenderbuffer);
  // gl.deleteFramebuffer(someFramebuffer);
};

