// from http://webglfundamentals.org/webgl/lessons/webgl-boilerplate.html

/**
 * @param {HTMLCanvasElement} canvas
 * @returns {{
 *   gl: WebGLRenderingContext|WebGL2RenderingContext,
 *   version: number,
 * }}
 */
export const initializeWebGL = (
  canvas: HTMLCanvasElement,
): {
  gl: WebGLRenderingContext | WebGL2RenderingContext | undefined;
  version: number | undefined;
} => {
  //const gl2 = canvas.getContext("webgl2", { antialias: false });
  //if (gl2) {
  //  return { gl: gl2, version: 2 };
  //}
  const gl1 = canvas.getContext("webgl", { antialias: false });
  if (gl1) {
    return { gl: gl1, version: 1 };
  }
  return { gl: undefined, version: undefined };
};

/**
 * Creates and compiles a shader.
 *
 * @param {WebGLRenderingContext} gl The WebGL Context.
 * @param {string} shaderSource The GLSL source code for the shader.
 * @param {number} shaderType The type of shader, VERTEX_SHADER or
 *     FRAGMENT_SHADER.
 * @return {WebGLShader} The shader.
 */
const compileShader = (
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  shaderSource: string,
  shaderType: number,
): WebGLShader | null => {
  // Create the shader object
  const shader = gl.createShader(shaderType);
  if (!shader) {
    return shader;
  }
  // Set the shader source code.
  gl.shaderSource(shader, shaderSource);
  // Compile the shader
  gl.compileShader(shader);
  // Check if it compiled
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    // Something went wrong during compilation; get the error
    throw new Error(`could not compile shader: ${gl.getShaderInfoLog(shader)}`);
  }
  return shader;
};

/**
 * Creates a program from 2 shaders.
 *
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl The WebGL context.
 * @param {WebGLShader} vertexShader A vertex shader.
 * @param {WebGLShader} fragmentShader A fragment shader.
 * @return {WebGLProgram} A program.
 */
const createProgram = (
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
): WebGLProgram | null => {
  // create a program.
  const program = gl.createProgram();
  if (program === null) {
    return program;
  }
  // attach the shaders.
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  // link the program.
  gl.linkProgram(program);
  // Check if it linked.
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    // something went wrong with the link
    throw new Error(`program filed to link: ${gl.getProgramInfoLog(program)}`);
  }
  return program;
};

/**
 * Creates a shader from the content of a script tag.
 *
 * @param {WebGLRenderingContext} gl The WebGL Context.
 * @param {string} shaderSource the source code
 * @param {number} shaderType The type of shader to create.
 * @return {WebGLShader} A shader.
 */
const createShaderFromSource = (
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  shaderSource: string,
  shaderType: number,
): WebGLShader | null => compileShader(gl, shaderSource, shaderType);

/**
 * Creates a program from 2 script tags.
 *
 * @param {WebGLRenderingContext} gl The WebGL Context.
 * @param {string} vertexShaderSrc The id of the vertex shader script tag.
 * @param {string} fragmentShaderSrc The id of the fragment shader script tag.
 * @return {WebGLProgram} A program
 */
export const createProgramFromSource = (
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  vertexShaderSrc: string,
  fragmentShaderSrc: string,
): WebGLProgram => {
  const vertexShader = createShaderFromSource(gl, vertexShaderSrc, gl.VERTEX_SHADER);
  const fragmentShader = createShaderFromSource(
    gl,
    fragmentShaderSrc,
    gl.FRAGMENT_SHADER,
  );
  return !vertexShader || !fragmentShader
    ? null
    : createProgram(gl, vertexShader, fragmentShader);
};

/**
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl the WebGL Context.
 * @param {WebGLProgram} program
 */
export const loadVertexData = (
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  program: WebGLProgram,
): void => {
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  );
  // look up where the vertex data needs to go.
  const positionLocation = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
};

/**
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl the WebGL Context
 * @param {number} width
 * @param {number} height
 * @param {number} type
 * @param {ArrayBufferView} data
 */
export const makeTexture = (
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  width: number,
  height: number,
  type: GLenum,
  data: ArrayBufferView,
): WebGLTexture => {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // Set the parameters so we can render any size image.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, type, data);
  return texture;
};
