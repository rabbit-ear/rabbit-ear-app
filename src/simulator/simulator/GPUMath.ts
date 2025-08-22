/**
 * Created by ghassaei on 2/24/16.
 */
import type { Model } from "./Model.ts";
import type { Edge } from "./Edge.ts";
import {
  createProgramFromSource,
  loadVertexData,
  makeTexture,
  initializeWebGL,
} from "./WebGL.ts";
import { fitToPow2 } from "./math.ts";
import { initGPU } from "./initGPU.ts";
import { normalize, dot, subtract } from "../general/math.ts";
import { verticesFaces } from "./verticesFaces.ts";

const calcDt = (model: Model): number => {
  let maxFreqNat = 0;
  model.edges.forEach((beam: Edge) => {
    if (beam.getNaturalFrequency() > maxFreqNat) {
      maxFreqNat = beam.getNaturalFrequency();
    }
  });
  // 0.9 of max delta t for good measure
  return (1 / (2 * Math.PI * maxFreqNat)) * 0.9;
};

const notSupported = (): void => {
  console.warn("floating point textures are not supported on your system");
};

export type SolverOptions = {
  creasePercent?: number;
  axialStiffness?: number;
  faceStiffness?: number;
  joinStiffness?: number;
  creaseStiffness?: number;
  dampingRatio?: number;
  calcFaceStrain?: boolean;
};

// default settings for origami simulator
export const defaultSolverOptions: SolverOptions = Object.freeze({
  creasePercent: 0.0,
  axialStiffness: 20,
  faceStiffness: 0.2,
  joinStiffness: 0.7,
  creaseStiffness: 0.7,
  dampingRatio: 0.45,
  calcFaceStrain: false,
});

export type GPUMathSettings = {
  textureDimNodes: number;
  textureDimFaces: number;
  textureDimCreases: number;
  textureDimNodeEdges: number;
  textureDimNodeFaces: number;
  textureDimNodeCreases: number;
  position: Float32Array;
  lastPosition: Float32Array;
  lastLastPosition: Float32Array;
  velocity: Float32Array;
  lastVelocity: Float32Array;
  meta: Float32Array;
  meta2: Float32Array;
  normals: Float32Array;
  faceVertexIndices: Float32Array;
  nodeFaceMeta: Float32Array;
  nominalTriangles: Float32Array;
  nodeCreaseMeta: Float32Array;
  creaseMeta2: Float32Array;
  creaseGeo: Float32Array;
  theta: Float32Array;
  lastTheta: Float32Array;
};

export class GPUMath implements GPUMathSettings {
  float_type: string = "FLOAT";

  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext | WebGL2RenderingContext;
  version: number;
  programs: {
    [key: string]: {
      program: WebGLProgram;
      uniforms: { [key: string]: WebGLUniformLocation };
    };
  };
  frameBuffers: { [key: string]: WebGLFramebuffer };
  textures: { [key: string]: WebGLTexture };
  index: number;

  integrationType: string = "euler";

  textureDimNodes: number;
  textureDimFaces: number;
  textureDimCreases: number;
  textureDimNodeEdges: number;
  textureDimNodeFaces: number;
  textureDimNodeCreases: number;
  position: Float32Array;
  lastPosition: Float32Array;
  lastLastPosition: Float32Array;
  velocity: Float32Array;
  lastVelocity: Float32Array;
  meta: Float32Array;
  meta2: Float32Array;
  normals: Float32Array;
  faceVertexIndices: Float32Array;
  nodeFaceMeta: Float32Array;
  nominalTriangles: Float32Array;
  nodeCreaseMeta: Float32Array;
  creaseMeta2: Float32Array;
  creaseGeo: Float32Array;
  theta: Float32Array;
  lastTheta: Float32Array;

  originalPosition: Float32Array;
  externalForces: Float32Array;
  mass: Float32Array;
  beamMeta: Float32Array;
  creaseVectors: Float32Array;
  creaseMeta: Float32Array;

  // options like "creasePercent" will start off the model in a folded state.
  constructor(model: Model, options: SolverOptions = {}) {
    this.programs = {};
    this.frameBuffers = {};
    this.textures = {};
    this.index = 0;
    this.initCanvas();
    this.initArrays(model);
    this.fillArrays(model);
    initGPU(this, this, options);
    this.setSolveParams(model);
  }

  initCanvas(): void {
    this.canvas = window.document.createElement("canvas");
    this.canvas.setAttribute("style", "display:none;");
    this.canvas.setAttribute("class", "gpu-canvas");
    window.document.body.appendChild(this.canvas);
    const { gl, version } = initializeWebGL(this.canvas);
    this.gl = gl;
    this.version = version;
    console.log(`initializing webgl version ${version}`);
    if (version === 1 && !this.gl.getExtension("OES_texture_float")) {
      notSupported();
    }
    this.gl.disable(this.gl.DEPTH_TEST);
  }

  initArrays(model: Model): void {
    const numNodes = model.fold.vertices_coords.length;
    const numFaces = model.fold.faces_vertices.length;
    const numCreases = model.creases.length;
    const numNodeFaces = model.fold.vertices_faces
      .map((faces) => faces.filter((a) => a !== undefined && a !== null).length)
      .reduce((a, b) => a + b, 0);
    const numNodeEdges = model.fold.vertices_edges.reduce((a, b) => a + b.length, 0);

    // numNodeCreases + reactions
    const numNodeCreases =
      numCreases * 2 +
      model.nodes.map((node) => node.creases.length).reduce((a, b) => a + b, 0);
    const textureDimNodes = fitToPow2(numNodes);
    const textureDimFaces = fitToPow2(numFaces);
    const textureDimCreases = fitToPow2(numCreases);
    const textureDimNodeEdges = fitToPow2(numNodeEdges);
    const textureDimNodeFaces = fitToPow2(numNodeFaces);
    const textureDimNodeCreases = fitToPow2(numNodeCreases);

    this.textureDimNodes = textureDimNodes;
    this.textureDimFaces = textureDimFaces;
    this.textureDimCreases = textureDimCreases;
    this.textureDimNodeEdges = textureDimNodeEdges;
    this.textureDimNodeFaces = textureDimNodeFaces;
    this.textureDimNodeCreases = textureDimNodeCreases;

    this.position = new Float32Array(textureDimNodes ** 2 * 4);
    this.lastPosition = new Float32Array(textureDimNodes ** 2 * 4);
    this.lastLastPosition = new Float32Array(textureDimNodes ** 2 * 4);
    this.velocity = new Float32Array(textureDimNodes ** 2 * 4);
    this.lastVelocity = new Float32Array(textureDimNodes ** 2 * 4);
    this.meta = new Float32Array(textureDimNodes ** 2 * 4);
    this.meta2 = new Float32Array(textureDimNodes ** 2 * 4);
    this.normals = new Float32Array(textureDimFaces ** 2 * 4);
    this.faceVertexIndices = new Float32Array(textureDimFaces ** 2 * 4);
    this.nodeFaceMeta = new Float32Array(textureDimNodeFaces ** 2 * 4);
    this.nominalTriangles = new Float32Array(textureDimFaces ** 2 * 4);
    this.nodeCreaseMeta = new Float32Array(textureDimNodeCreases ** 2 * 4);
    this.creaseMeta2 = new Float32Array(textureDimCreases ** 2 * 4);
    this.creaseGeo = new Float32Array(textureDimCreases ** 2 * 4);
    this.theta = new Float32Array(textureDimCreases ** 2 * 4);
    this.lastTheta = new Float32Array(textureDimCreases ** 2 * 4);

    this.originalPosition = new Float32Array(textureDimNodes ** 2 * 4);
    this.externalForces = new Float32Array(textureDimNodes ** 2 * 4);
    this.mass = new Float32Array(textureDimNodes ** 2 * 4);
    this.beamMeta = new Float32Array(textureDimNodeEdges ** 2 * 4);
    this.creaseVectors = new Float32Array(textureDimCreases ** 2 * 4);
    this.creaseMeta = new Float32Array(textureDimCreases ** 2 * 4);
  }

  setSolveParams(model: Model): void {
    const dt = calcDt(model);
    // $("#deltaT").html(dt);
    this.setProgram("thetaCalc");
    this.setUniformForProgram("thetaCalc", "u_dt", dt, "1f");
    this.setProgram("velocityCalc");
    this.setUniformForProgram("velocityCalc", "u_dt", dt, "1f");
    this.setProgram("positionCalcVerlet");
    this.setUniformForProgram("positionCalcVerlet", "u_dt", dt, "1f");
    this.setProgram("positionCalc");
    this.setUniformForProgram("positionCalc", "u_dt", dt, "1f");
    this.setProgram("velocityCalcVerlet");
    this.setUniformForProgram("velocityCalcVerlet", "u_dt", dt, "1f");
    // options.controls.setDeltaT(dt);
  }

  fillArrays(model: Model): void {
    // array initialization was cut from here
    const numCreases = model.creases.length;
    const nodeFaces = verticesFaces(model);

    for (let i = 0; i < model.fold.faces_vertices.length; i += 1) {
      const face = model.fold.faces_vertices[i];
      this.faceVertexIndices[4 * i + 0] = face[0];
      this.faceVertexIndices[4 * i + 1] = face[1];
      this.faceVertexIndices[4 * i + 2] = face[2];
      //const a = model.nodes[face[0]].originalPosition;
      //const b = model.nodes[face[1]].originalPosition;
      //const c = model.nodes[face[2]].originalPosition;
      const a = model.fold.vertices_coordsInitial[face[0]];
      const b = model.fold.vertices_coordsInitial[face[1]];
      const c = model.fold.vertices_coordsInitial[face[2]];
      const ab = normalize(subtract(b, a));
      const ac = normalize(subtract(c, a));
      const bc = normalize(subtract(c, b));
      this.nominalTriangles[4 * i + 0] = Math.acos(dot(ab, ac));
      this.nominalTriangles[4 * i + 1] = Math.acos(-1 * dot(ab, bc));
      this.nominalTriangles[4 * i + 2] = Math.acos(dot(ac, bc));
      if (
        Math.abs(
          this.nominalTriangles[4 * i] +
            this.nominalTriangles[4 * i + 1] +
            this.nominalTriangles[4 * i + 2] -
            Math.PI,
        ) > 0.1
      ) {
        console.warn("bad angles");
      }
    }

    for (let i = 0; i < this.textureDimNodes * this.textureDimNodes; i += 1) {
      this.mass[4 * i + 1] = 1; // set all fixed by default
    }

    for (let i = 0; i < this.textureDimCreases * this.textureDimCreases; i += 1) {
      if (i >= numCreases) {
        this.lastTheta[i * 4 + 2] = -1;
        this.lastTheta[i * 4 + 3] = -1;
        continue;
      }
      this.lastTheta[i * 4 + 2] = model.creases[i].faces[0];
      this.lastTheta[i * 4 + 3] = model.creases[i].faces[1];
    }

    let index = 0;
    for (let i = 0; i < model.nodes.length; i += 1) {
      this.meta2[4 * i] = index;
      const num = nodeFaces[i].length;
      this.meta2[4 * i + 1] = num;
      for (let j = 0; j < num; j += 1) {
        const _index = (index + j) * 4;
        const face = model.fold.faces_vertices[nodeFaces[i][j]];
        this.nodeFaceMeta[_index] = nodeFaces[i][j];
        this.nodeFaceMeta[_index + 1] = face[0] === i ? -1 : face[0];
        this.nodeFaceMeta[_index + 2] = face[1] === i ? -1 : face[1];
        this.nodeFaceMeta[_index + 3] = face[2] === i ? -1 : face[2];
      }
      index += num;
    }

    index = 0;
    for (let i = 0; i < model.nodes.length; i += 1) {
      this.mass[4 * i] = model.nodes[i].simMass;
      this.meta[i * 4 + 2] = index;
      const nodeCreases = model.nodes[i].creases;
      // nodes attached to crease move in opposite direction
      const nodeInvCreases = model.nodes[i].invCreases;
      this.meta[i * 4 + 3] = nodeCreases.length + nodeInvCreases.length;
      for (let j = 0; j < nodeCreases.length; j += 1) {
        this.nodeCreaseMeta[index * 4] = nodeCreases[j].index;
        // type 1, 2, 3, 4
        this.nodeCreaseMeta[index * 4 + 1] = nodeCreases[j].getNodeIndex(model.nodes[i]);
        index += 1;
      }
      for (let j = 0; j < nodeInvCreases.length; j += 1) {
        this.nodeCreaseMeta[index * 4] = nodeInvCreases[j].index;
        // type 1, 2, 3, 4
        this.nodeCreaseMeta[index * 4 + 1] = nodeInvCreases[j].getNodeIndex(
          model.nodes[i],
        );
        index += 1;
      }
    }

    for (let i = 0; i < model.creases.length; i += 1) {
      const crease = model.creases[i];
      this.creaseMeta2[i * 4 + 0] = crease.nodes[0].index;
      this.creaseMeta2[i * 4 + 1] = crease.nodes[1].index;
      this.creaseMeta2[i * 4 + 2] = crease.edge.nodes[0].index;
      this.creaseMeta2[i * 4 + 3] = crease.edge.nodes[1].index;
      index += 1;
    }

    this.updateOriginalPosition(model);
    this.updateMaterials(model, true);
    this.updateFixed(model);
    this.updateExternalForces(model);
    this.updateCreasesMeta(model, true);
    this.updateCreaseVectors(model);
  }

  /**
   * @param {string} programName
   * @param {string} vertexShader
   * @param {string} fragmentShader
   */
  createProgram(programName: string, vertexShader: string, fragmentShader: string): void {
    const programs = this.programs;
    const existing = programs[programName];
    if (existing) {
      this.gl.useProgram(existing.program);
      // console.warn("already a program with the name " + programName);
      return;
    }
    const program = createProgramFromSource(this.gl, vertexShader, fragmentShader);
    this.gl.useProgram(program);
    loadVertexData(this.gl, program);
    programs[programName] = {
      program,
      uniforms: {},
    };
  }

  /**
   * @param {string} name
   * @param {number} width
   * @param {number} height
   * @param {string} typeName
   * @param {ArrayBufferView} data
   * @param {boolean} shouldReplace
   */
  initTextureFromData(
    name: string,
    width: number,
    height: number,
    typeName: string,
    data: ArrayBufferView,
    shouldReplace: boolean,
  ): void {
    let texture = this.textures[name];

    if (texture) {
      if (!shouldReplace) {
        console.warn(`already a texture with the name ${name}`);
        return;
      }
      this.gl.deleteTexture(texture);
    }
    texture = makeTexture(this.gl, width, height, this.gl[typeName], data);
    this.textures[name] = texture;
  }

  /**
   * @param {string} textureName
   * @param {boolean} shouldReplace
   */
  initFrameBufferForTexture(textureName: string, shouldReplace: boolean): void {
    let framebuffer = this.frameBuffers[textureName];
    if (framebuffer) {
      if (!shouldReplace) {
        console.warn(`framebuffer already exists for texture ${textureName}`);
        return;
      }
      this.gl.deleteFramebuffer(framebuffer);
    }
    const texture = this.textures[textureName];
    if (!texture) {
      console.warn(`texture ${textureName} does not exist`);
      return;
    }

    framebuffer = this.gl.createFramebuffer();
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer);
    this.gl.framebufferTexture2D(
      this.gl.FRAMEBUFFER,
      this.gl.COLOR_ATTACHMENT0,
      this.gl.TEXTURE_2D,
      texture,
      0,
    );

    // not sure what to do with this line, but it suppresses a
    // warning having to do with checkFramebufferStatus
    this.gl.getExtension("WEBGL_color_buffer_float");
    const check = this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER);
    if (check !== this.gl.FRAMEBUFFER_COMPLETE) {
      notSupported();
    }

    this.frameBuffers[textureName] = framebuffer;
  }

  /**
   * @param {string} programName
   * @param {string} name
   * @param {any} val
   * @param {string} type
   */
  setUniformForProgram(
    programName: string,
    name: string,
    val: unknown,
    type: string,
  ): void {
    if (!this.programs[programName]) {
      console.log(programName, this.programs, this.programs[programName]);
      console.warn(`no program with name ${programName}`);
      return;
    }
    const uniforms = this.programs[programName].uniforms;
    let location = uniforms[name];
    if (!location) {
      location = this.gl.getUniformLocation(this.programs[programName].program, name);
      uniforms[name] = location;
    }
    switch (type) {
      case "1f":
        this.gl.uniform1f(location, val as number);
        break;
      case "2f":
        {
          const [a, b]: [number, number] = val as [number, number];
          this.gl.uniform2f(location, a, b);
        }
        break;
      case "3f":
        {
          const [a, b, c]: [number, number, number] = val as [number, number, number];
          this.gl.uniform3f(location, a, b, c);
        }
        break;
      case "1i":
        this.gl.uniform1i(location, val as number);
        break;
      default:
        console.warn(`no uniform for type ${type}`);
        break;
    }
  }

  /**
   * @param {number} width
   * @param {number} height
   */
  setSize(width: number, height: number): void {
    this.gl.viewport(0, 0, width, height);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
  }

  /**
   * @param {string} programName
   */
  setProgram(programName: string): void {
    const program = this.programs[programName];
    if (program) {
      this.gl.useProgram(program.program);
    }
  }

  /**
   * @param {string} programName
   * @param {string[]} inputTextures
   * @param {string} outputTexture
   * @param {number} [time]
   */
  step(
    programName: string,
    inputTextures: string[],
    outputTexture: string,
    time?: number,
  ): void {
    this.gl.useProgram(this.programs[programName].program);
    // todo: are we passing time 0 to bypass this, or can we write if (time === undefined)
    if (time) {
      this.setUniformForProgram(programName, "u_time", time, "1f");
    }
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffers[outputTexture]);
    for (let i = 0; i < inputTextures.length; i += 1) {
      this.gl.activeTexture(this.gl.TEXTURE0 + i);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[inputTextures[i]]);
    }
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4); // draw to framebuffer
  }

  /**
   * @param {string} texture1Name
   * @param {string} texture2Name
   */
  swapTextures2(texture1Name: string, texture2Name: string): void {
    // todo array swap notation
    let temp = this.textures[texture1Name];
    this.textures[texture1Name] = this.textures[texture2Name];
    this.textures[texture2Name] = temp;
    temp = this.frameBuffers[texture1Name];
    this.frameBuffers[texture1Name] = this.frameBuffers[texture2Name];
    this.frameBuffers[texture2Name] = temp;
  }

  /**
   * @param {string} texture1Name
   * @param {string} texture2Name
   * @param {string} texture3Name
   */
  swapTextures3(texture1Name: string, texture2Name: string, texture3Name: string): void {
    let temp = this.textures[texture3Name];
    this.textures[texture3Name] = this.textures[texture2Name];
    this.textures[texture2Name] = this.textures[texture1Name];
    this.textures[texture1Name] = temp;
    temp = this.frameBuffers[texture3Name];
    this.frameBuffers[texture3Name] = this.frameBuffers[texture2Name];
    this.frameBuffers[texture2Name] = this.frameBuffers[texture1Name];
    this.frameBuffers[texture1Name] = temp;
  }

  /**
   * @returns {boolean}
   */
  readyToRead(): boolean {
    return (
      this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER) === this.gl.FRAMEBUFFER_COMPLETE
    );
  }

  /**
   * @param {number} xMin
   * @param {number} yMin
   * @param {number} width
   * @param {number} height
   * @param {ArrayBufferView} array
   */
  readPixels(
    xMin: number,
    yMin: number,
    width: number,
    height: number,
    array: ArrayBufferView,
  ): void {
    this.gl.readPixels(
      xMin,
      yMin,
      width,
      height,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      array,
    );
  }

  updateMaterials(model: Model, initing = false): void {
    let index = 0;
    for (let i = 0; i < model.nodes.length; i += 1) {
      if (initing) {
        this.meta[4 * i] = index;
        this.meta[4 * i + 1] = model.nodes[i].edges.length;
      }
      for (let j = 0; j < model.nodes[i].edges.length; j += 1) {
        const beam = model.nodes[i].edges[j];
        this.beamMeta[4 * index] = beam.getK();
        this.beamMeta[4 * index + 1] = beam.getD();
        if (initing) {
          this.beamMeta[4 * index + 2] = beam.getLength();
          this.beamMeta[4 * index + 3] = beam.getOtherNode(model.nodes[i]).index;
        }
        index += 1;
      }
    }
    this.initTextureFromData(
      "u_beamMeta",
      this.textureDimNodeEdges,
      this.textureDimNodeEdges,
      this.float_type,
      this.beamMeta,
      true,
    );
  }

  updateExternalForces(model: Model): void {
    for (let i = 0; i < model.nodes.length; i += 1) {
      // external forces is always 0, 0, 0
      const [x, y, z] = model.nodes[i].externalForce;
      this.externalForces[i * 4 + 0] = x;
      this.externalForces[i * 4 + 1] = y;
      this.externalForces[i * 4 + 2] = z;
    }
    this.initTextureFromData(
      "u_externalForces",
      this.textureDimNodes,
      this.textureDimNodes,
      this.float_type,
      this.externalForces,
      true,
    );
  }

  updateFixed(model: Model): void {
    for (let i = 0; i < model.nodes.length; i += 1) {
      this.mass[4 * i + 1] = model.nodes[i].fixed ? 1 : 0;
    }
    this.initTextureFromData(
      "u_mass",
      this.textureDimNodes,
      this.textureDimNodes,
      this.float_type,
      this.mass,
      true,
    );
  }

  /**
   * @description todo
   * @param {GPUMath} gpuMath
   * @param {Model} model
   */
  updateOriginalPosition(model: Model): void {
    for (let i = 0; i < model.fold.vertices_coordsInitial.length; i += 1) {
      //const [x, y, z] = model.nodes[i].originalPosition;
      const [x, y, z] = model.fold.vertices_coordsInitial[i];
      this.originalPosition[i * 4 + 0] = x;
      this.originalPosition[i * 4 + 1] = y;
      this.originalPosition[i * 4 + 2] = z;
    }
    this.initTextureFromData(
      "u_originalPosition",
      this.textureDimNodes,
      this.textureDimNodes,
      this.float_type,
      this.originalPosition,
      true,
    );
  }

  /**
   * @description todo
   * @param {GPUMath} gpuMath
   * @param {Model} model
   */
  updateCreaseVectors(model: Model): void {
    for (let i = 0; i < model.creases.length; i += 1) {
      const rgbaIndex = i * 4;
      const nodes = model.creases[i].edge.nodes;
      // this.vertices[1].clone().sub(this.vertices[0]);
      this.creaseVectors[rgbaIndex] = nodes[0].index;
      this.creaseVectors[rgbaIndex + 1] = nodes[1].index;
    }
    this.initTextureFromData(
      "u_creaseVectors",
      this.textureDimCreases,
      this.textureDimCreases,
      this.float_type,
      this.creaseVectors,
      true,
    );
  }

  /**
   * @description todo
   * @param {GPUMath} gpuMath
   * @param {Model} model
   */
  updateCreasesMeta(model: Model, initing = false): void {
    for (let i = 0; i < model.creases.length; i += 1) {
      const crease = model.creases[i];
      this.creaseMeta[i * 4] = crease.getK();
      // creaseMeta[i * 4 + 1] = crease.getD();
    }
    if (initing) {
      for (let i = 0; i < model.creases.length; i += 1) {
        const crease = model.creases[i];
        this.creaseMeta[i * 4 + 2] = crease.targetTheta;
      }
    }
    this.initTextureFromData(
      "u_creaseMeta",
      this.textureDimCreases,
      this.textureDimCreases,
      this.float_type,
      this.creaseMeta,
      true,
    );
  }

  /**
   * @description todo
   * @param {GPUMath} gpuMath
   * @param {Model} model
   */
  updateLastPosition(model: Model): void {
    for (let i = 0; i < model.nodes.length; i += 1) {
      // const [x, y, z] = model.nodes[i].getRelativePosition();
      const position: [number, number, number] = [
        model.positions[model.nodes[i].index * 3 + 0],
        model.positions[model.nodes[i].index * 3 + 1],
        model.positions[model.nodes[i].index * 3 + 2],
      ];
      //const [x, y, z] = subtract(position, model.nodes[i].originalPosition);
      const [x, y, z] = subtract(position, model.fold.vertices_coordsInitial[i]);
      this.lastPosition[i * 4 + 0] = x;
      this.lastPosition[i * 4 + 1] = y;
      this.lastPosition[i * 4 + 2] = z;
    }
    this.initTextureFromData(
      "u_lastPosition",
      this.textureDimNodes,
      this.textureDimNodes,
      this.float_type,
      this.lastPosition,
      true,
    );
    this.initFrameBufferForTexture("u_lastPosition", true);
  }

  dealloc(): void {
    Object.values(this.programs)
      .map((el) => el.program)
      .forEach((prog) => this.gl.deleteProgram(prog));
    Object.values(this.frameBuffers).forEach((buf) => this.gl.deleteFramebuffer(buf));
    Object.values(this.textures).forEach((texture) => this.gl.deleteTexture(texture));
    this.programs = {};
    this.frameBuffers = {};
    this.textures = {};
    this.setSize(1, 1);
    window.document.body.removeChild(this.canvas);

    // var buf = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    // var numAttributes = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
    // for (var attrib = 0; attrib < numAttributes; ++attrib) {
    //   gl.vertexAttribPointer(attrib, 1, gl.FLOAT, false, 0, 0);
    // }
  }
}
