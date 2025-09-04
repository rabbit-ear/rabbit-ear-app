import type { FOLD, FOLDMesh } from "../types.ts";
import type { SolverOptions } from "./GPUMath.ts";
import { defaultSolverOptions } from "./GPUMath.ts";
import { GPUMath } from "./GPUMath.ts";
import { makeNode, destroyNode, type Node } from "./Node.ts";
import { Edge } from "./Edge.ts";
import { Crease } from "./Crease.ts";
import { prepare } from "../fold/prepare.ts";
import { getFOLDCenter } from "../fold/boundingBox.ts";
import { makeCreasesParams } from "../fold/creaseParams.ts";
import { exportFOLD } from "./exportFOLD.ts";
import { makeTypedArrays } from "./typedArrays.ts";
import { solveStep, render } from "./solve.ts";

/**
 * @description Get the center of the bounding box of the model.
 * @param {Model} model
 */
const modelCenter = (positions: Float32Array): [number, number, number] => {
  if (!positions.length) {
    return [0, 0, 0];
  }
  const min = Array(3).fill(Infinity);
  const max = Array(3).fill(-Infinity);
  for (let i = 0; i < positions.length; i += 3) {
    for (let dim = 0; dim < 3; dim += 1) {
      min[dim] = Math.min(min[dim], positions[i + dim]);
      max[dim] = Math.max(max[dim], positions[i + dim]);
    }
  }
  return [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2];
};

export class Model {
  initialFOLD: FOLD;
  fold: FOLDMesh;
  center: [number, number, number];

  gpuMath: GPUMath;

  strain: boolean;

  #axialStiffness: number;
  #joinStiffness: number;
  #creaseStiffness: number;
  #dampingRatio: number;

  // vertex / color buffer arrays for GPU
  positions: Float32Array;
  colors: Float32Array;
  indices: Uint16Array;
  lineIndices: { [key: string]: Uint16Array };

  nodes: Node[];
  edges: Edge[];
  creases: Crease[];

  /**
   * @description Load a new FOLD object into origami simulator.
   * Immediately following this method the solver should call .setModel()
   */
  constructor(foldObject: FOLD, options?: SolverOptions) {
    // makeObjects(fold: FOLDMesh): void
    options = { ...defaultSolverOptions, ...options };

    this.initialFOLD = foldObject;
    this.fold = prepare(foldObject);
    const center = getFOLDCenter(this.fold);

    // here is a hack to bring the model to the center of the scene
    // that also works with the ray caster. for whatever reason,
    // translating the model or translating a parent layer causes the
    // raycaster to fail outside of the boundary which would have been eclipsed.
    this.fold.vertices_coords = this.fold.vertices_coords.map(([x, y, z]) => [
      x - center[0],
      y - center[1],
      z - center[2],
    ]);
    try {
      this.fold.vertices_coordsInitial = structuredClone(this.fold.vertices_coords);
    } catch (err) {
      console.log("simulator Model() clone error");
      console.log(err);
    }

    this.#axialStiffness = 20;
    this.#joinStiffness = 0.7;
    this.#creaseStiffness = 0.7;
    this.#dampingRatio = 0.45;

    // will get rid of these eventually
    this.nodes = this.fold.vertices_coords.map(makeNode);

    // will get rid of these eventually
    this.edges = this.fold.edges_vertices
      .map((ev) => ev.map((v) => this.nodes[v]))
      .map(([a, b]) => new Edge([a, b], options));

    // will move creases here
    this.creases = makeCreasesParams(this.fold).map(
      (param, index) =>
        new Crease({
          edge: this.edges[param.edge],
          index,
          type: param.foldAngle !== 0 ? 1 : 0, // type
          faces: param.faces,
          nodes: param.vertices.map((v) => this.nodes[v]) as [Node, Node],
          targetTheta: param.foldAngle * (Math.PI / 180), // until now this was in degrees
          options,
        }),
    );
    this.fold.creases = this.creases;

    const { positions, colors, indices, lineIndices } = makeTypedArrays(this.fold);

    // save these for the solver to modify
    this.positions = positions;
    this.colors = colors;
    this.indices = indices;
    this.lineIndices = lineIndices;

    this.gpuMath = new GPUMath(this);
  }

  /**
   * @description Reset the vertices of the model back to their original state.
   * @returns {number} the global error as a percent
   */
  reset(): number {
    this.gpuMath.step("zeroTexture", [], "u_position");
    this.gpuMath.step("zeroTexture", [], "u_lastPosition");
    this.gpuMath.step("zeroTexture", [], "u_lastLastPosition");
    this.gpuMath.step("zeroTexture", [], "u_velocity");
    this.gpuMath.step("zeroTexture", [], "u_lastVelocity");
    this.gpuMath.step("zeroThetaTexture", ["u_lastTheta"], "u_theta");
    this.gpuMath.step("zeroThetaTexture", ["u_theta"], "u_lastTheta");

    return render(this.gpuMath, this, this.strain);
  }

  /**
   * @description The user will call this method when the UI is pulling on a
   * vertex, this conveys to the solver that a node is being manually moved.
   */
  nodeDidMove(): void {
    this.gpuMath.updateLastPosition(this);
    const [x, y, z] = modelCenter(this.positions);
    this.gpuMath.setProgram("centerTexture");
    this.gpuMath.setUniformForProgram("centerTexture", "u_center", [x, y, z], "3f");
    this.gpuMath.step("centerTexture", ["u_lastPosition"], "u_position");
    if (this.gpuMath.integrationType === "verlet") {
      this.gpuMath.step("copyTexture", ["u_position"], "u_lastLastPosition");
    }
    this.gpuMath.swapTextures2("u_position", "u_lastPosition");
    this.gpuMath.step("zeroTexture", [], "u_lastVelocity");
    this.gpuMath.step("zeroTexture", [], "u_velocity");
  }

  /**
   * @description Some properties require rewrite to the shader textures,
   * after setting these properties, call this to update the texture data.
   */
  update(initing: boolean = false): void {
    // { creaseMeta, textureDimCreases }
    this.gpuMath.updateCreasesMeta(this, initing);
    // { meta, beamMeta, textureDimNodeEdges }
    this.gpuMath.updateMaterials(this, initing);
  }

  /**
   * @description Call this method from inside the animation frame loop.
   * This will pack the model's positions into a vertices_coords FOLD array.
   * The rest of the graph (edges, faces) will not change so they can be cached
   * at load, then this is the only FOLD array that needs updating in the loop.
   */
  get vertices_coords(): [number, number, number][] {
    const length = Math.floor(this.positions.length / 3);
    return Array.from(Array(length)).map(
      (_, v) =>
        [v * 3, v * 3 + 1, v * 3 + 2].map((i) => this.positions[i]) as [
          number,
          number,
          number,
        ],
    );
  }

  set integration(integration: string) {
    this.gpuMath.integrationType = integration;
    this.reset();
  }

  set foldAmount(value: string | number) {
    const number = typeof value === "number" ? value : parseFloat(value);
    this.gpuMath.setProgram("velocityCalc");
    this.gpuMath.setUniformForProgram("velocityCalc", "u_creasePercent", number, "1f");
    this.gpuMath.setProgram("positionCalcVerlet");
    this.gpuMath.setUniformForProgram(
      "positionCalcVerlet",
      "u_creasePercent",
      number,
      "1f",
    );
    this.update();
  }

  get axialStiffness(): number {
    return this.#axialStiffness;
  }
  set axialStiffness(value: string | number) {
    const number = typeof value === "number" ? value : parseFloat(value);
    this.gpuMath.setProgram("velocityCalc");
    this.gpuMath.setUniformForProgram("velocityCalc", "u_axialStiffness", number, "1f");
    this.gpuMath.setProgram("positionCalcVerlet");
    this.gpuMath.setUniformForProgram(
      "positionCalcVerlet",
      "u_axialStiffness",
      number,
      "1f",
    );
    this.#axialStiffness = typeof value === "number" ? value : parseFloat(value);
    this.edges.forEach((edge) => {
      edge.axialStiffness = this.#axialStiffness;
    });
    this.update();
  }

  set faceStiffness(value: string | number) {
    const number = typeof value === "number" ? value : parseFloat(value);
    this.gpuMath.setProgram("velocityCalc");
    this.gpuMath.setUniformForProgram("velocityCalc", "u_faceStiffness", number, "1f");
    this.gpuMath.setProgram("positionCalcVerlet");
    this.gpuMath.setUniformForProgram(
      "positionCalcVerlet",
      "u_faceStiffness",
      number,
      "1f",
    );
    this.update();
  }

  set faceStrain(value: string | number) {
    const number = typeof value === "number" ? value : parseFloat(value);
    this.gpuMath.setProgram("velocityCalc");
    this.gpuMath.setUniformForProgram("velocityCalc", "u_calcFaceStrain", number, "1f");
    this.gpuMath.setProgram("positionCalcVerlet");
    this.gpuMath.setUniformForProgram(
      "positionCalcVerlet",
      "u_calcFaceStrain",
      number,
      "1f",
    );
    this.update();
  }

  set joinStiffness(value: number | string) {
    this.#joinStiffness = typeof value === "number" ? value : parseFloat(value);
    this.creases.forEach((crease) => {
      crease.joinStiffness = this.#joinStiffness;
    });
    this.update();
  }

  set creaseStiffness(value: number | string) {
    this.#creaseStiffness = typeof value === "number" ? value : parseFloat(value);
    this.creases.forEach((crease) => {
      crease.creaseStiffness = this.#creaseStiffness;
    });
    this.update();
  }

  set dampingRatio(value: number | string) {
    this.#dampingRatio = typeof value === "number" ? value : parseFloat(value);
    this.creases.forEach((crease) => {
      crease.dampingRatio = this.#dampingRatio;
    });
    this.edges.forEach((edge) => {
      edge.dampingRatio = this.#dampingRatio;
    });
    this.update();
  }

  /**
   * @returns {number} the global error as a percent
   * @param {number} numSteps number of iterations to run the solver
   * @param {boolean} computeStrain should the strain values be computed?
   */
  solve(numSteps: number = 100): number {
    for (let j = 0; j < numSteps; j += 1) {
      solveStep(this.gpuMath, this.gpuMath);
    }
    return render(this.gpuMath, this, this.strain);
  }

  export(options?: { triangulated: boolean }): FOLD {
    return exportFOLD(this, this.initialFOLD, this.fold, options);
  }

  dealloc(): void {
    //this.fold = {};
    this.fold = undefined;
    this.initialFOLD = {};
    this.nodes.forEach(destroyNode);
    this.edges.forEach((edge) => edge.destroy());
    this.creases.forEach((crease) => crease.destroy());
    this.nodes = [];
    this.edges = [];
    this.creases = [];
    this.gpuMath.dealloc();
  }
}
