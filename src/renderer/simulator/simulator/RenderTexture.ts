import {
  initializeWebGL,
  createProgramFromSource,
  //loadVertexData,
  makeTexture,
} from "./WebGL.ts";

// to render the textures, the fragment shader will override the alpha
// value to be 1.0, so you can better see the raw RGB channels.

const vertexShader = `attribute vec4 a_position;
attribute vec2 a_texcoord;
uniform mat4 u_matrix;
varying vec2 v_texcoord;
void main() {
  gl_Position = u_matrix * a_position;
  v_texcoord = a_texcoord;
}`;

const fragmentShader = `precision mediump float;
varying vec2 v_texcoord;
uniform sampler2D u_texture;
void main() {
  vec4 color = texture2D(u_texture, v_texcoord);
  gl_FragColor = vec4(color.rgb, 1.0);
}`;

export class RenderTexture {
  gl: WebGLRenderingContext | WebGL2RenderingContext;
  program: WebGLProgram;
  texture: WebGLTexture;
  width: number;
  height: number;
  type: string = "FLOAT";

  positionBuffer: WebGLBuffer;
  texcoordBuffer: WebGLBuffer;

  matrix: number[];
  positionLocation: GLint;
  texcoordLocation: GLint;
  matrixLocation: WebGLUniformLocation;
  textureLocation: WebGLUniformLocation;

  constructor(canvas: HTMLCanvasElement) {
    const { gl } = initializeWebGL(canvas);
    this.gl = gl;
    this.program = createProgramFromSource(this.gl, vertexShader, fragmentShader);

    if (!gl.getExtension("OES_texture_float")) {
      window.alert("OES_texture_float not supported");
    }

    this.positionLocation = this.gl.getAttribLocation(this.program, "a_position");
    this.texcoordLocation = this.gl.getAttribLocation(this.program, "a_texcoord");
    this.matrixLocation = this.gl.getUniformLocation(this.program, "u_matrix");
    this.textureLocation = this.gl.getUniformLocation(this.program, "u_texture");

    this.matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    const positions = [-1, -1, -1, 1, 1, -1, 1, -1, -1, 1, 1, 1];
    const texcoords = [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1];

    this.positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(positions),
      this.gl.STATIC_DRAW,
    );

    // Create a buffer for texture coords
    this.texcoordBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texcoordBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(texcoords),
      this.gl.STATIC_DRAW,
    );
  }

  setFloatPixels(data: ArrayBufferView, width: number, height: number) {
    this.width = width;
    this.height = height;
    this.texture = makeTexture(this.gl, this.width, this.height, this.gl.FLOAT, data);
  }

  // Unlike images, textures do not have a width and height associated
  // with them so we'll pass in the width and height of the texture
  draw() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.useProgram(this.program);

    // Setup the attributes to pull data from our buffers
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.enableVertexAttribArray(this.positionLocation);
    this.gl.vertexAttribPointer(this.positionLocation, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texcoordBuffer);
    this.gl.enableVertexAttribArray(this.texcoordLocation);
    this.gl.vertexAttribPointer(this.texcoordLocation, 2, this.gl.FLOAT, false, 0, 0);

    this.gl.uniformMatrix4fv(this.matrixLocation, false, this.matrix);
    this.gl.uniform1i(this.textureLocation, 0);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }
}
