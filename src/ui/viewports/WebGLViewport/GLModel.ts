import type { WebGLViewport } from "./WebGLViewport.svelte";

export type VertexArray = {
  location: GLint;
  buffer: WebGLBuffer;
  type: number;
  length: number;
  data: Float32Array;
};

export type ElementArray = {
  // the mode of element drawing like GL_TRIANGLES, GL_LINES, etc..
  mode: GLint;
  buffer: WebGLBuffer;
  data: Uint16Array | Uint32Array;
};

export type UniformFunctionValue = {
  // name of the binding func, like "uniformMatrix4fv" or "uniform1f"
  func: string;
  // the value to be passed into the binding function.
  value: number | number[] | [number, number] | [number, number, number];
}

export interface GLModel {
  viewport: WebGLViewport;

  // this is the WebGL standard program, create this upon init.
  program: WebGLProgram | undefined;

  // the vertex array definition that relates to the
  // elements arrays below, passed into the draw call.
  vertexArrays: VertexArray[];

  // this model type is fixed to be using "drawElements" as the
  // draw call, here is the elements definition which includes
  // the buffer and the mode so it's possible to choose GL_LINES
  // or GL_TRIANGLES or any other mode.
  elementArrays: ElementArray[];

  // uniforms to be set before calling the draw call.
  // the key must match the name of the uniform in the shader
  // for example, "u_strokeWidth" for "uniform float u_strokeWidth;"
  // the value contains two keys: the name <string> of the function
  // to bind the uniform, like "uniformMatrix4fv" or "uniform1f",
  // and the value is the number(s) to pass into said function.
  uniforms: { [key: string]: UniformFunctionValue };

  // WebGL is a state machine, in here place flags that should be set
  // before drawing, and subsequently turned off after drawing,
  // for example a popular one is [gl.DEPTH_TEST]
  flags: number[];

  // which order (painter's algorithm, smallest first) should this
  // model be drawn. useful in particular if DEPTH_TEST is turned off.
  zIndex?: number;
}

export const drawGLModel = (
  gl: WebGLRenderingContext | WebGL2RenderingContext | undefined,
  version: number,
  model: GLModel) => {
  if (!gl || !model || !model.program) { return; }

  gl.useProgram(model.program);
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

  // console.log(model.vertexArrays[0]?.data.length, model.vertexArrays, model.elementArrays[0]?.data.length, model.elementArrays);
  // const numAttribs = gl.getProgramParameter(model.program, gl.ACTIVE_ATTRIBUTES);
  // for (let ii = 0; ii < numAttribs; ++ii) {
  //   const attribInfo = gl.getActiveAttrib(model.program, ii);
  //   if (!attribInfo) continue;
  //   const index = gl.getAttribLocation(model.program, attribInfo.name);
  //   console.log(index, attribInfo.name);
  // }

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
  if (!gl || !model.program || !gl.isProgram(model.program)) {
    console.log("deallocModel() - early exit. model already gone", gl, model.program);
    return;
  }
  model.vertexArrays.forEach((vert) => gl.disableVertexAttribArray(vert.location));
  model.vertexArrays.forEach((vert) => gl.deleteBuffer(vert.buffer));
  model.elementArrays.forEach((elements) => gl.deleteBuffer(elements.buffer));
  gl.deleteProgram(model.program);
  model.vertexArrays = [];
  model.elementArrays = [];
  model.program = undefined;
  // gl.deleteTexture(someTexture);
  // gl.deleteRenderbuffer(someRenderbuffer);
  // gl.deleteFramebuffer(someFramebuffer);
};

