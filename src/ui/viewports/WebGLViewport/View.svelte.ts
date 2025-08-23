import { untrack } from "svelte";
import {
  identity4x4,
  invertMatrix4,
  multiplyMatrices4,
  multiplyMatrix4Vector3,
} from "rabbit-ear/math/matrix4.js";
import type { VecLine2, VecLine3 } from "rabbit-ear/types.js";
import type { View } from "../View";
import { WebGLViewport } from "./WebGLViewport.svelte";
import { graphToMatrix4 } from "../../../general/matrix.ts";
import { makeProjectionMatrix } from "../../../general/matrix.ts";
// import { makeProjectionMatrix } from "rabbit-ear/webgl/general/view.js";
import context from "../../../app/context.svelte.ts";
import { RenderPerspective } from "../types.ts";

const defaultCameraMatrix: number[] = [
  1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, (Math.sqrt(3) / 2 + 1), 1,
];

const defaultViewMatrix: number[] = [
  1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -(Math.sqrt(3) / 2 + 1), 1,
];

export class WebGLView implements View {
  viewport: WebGLViewport;

  rightHanded: boolean = $derived(context.ui.settings.rightHanded.value ?? true);

  canvasSize: [number, number] = $state([0, 0]);

  perspective: RenderPerspective = $state(RenderPerspective.orthographic);

  fov: number = $state(30.25);

  projection: number[] = $derived.by(() => makeProjectionMatrix(
    this.canvasSize ?? [0, 0],
    this.perspective,
    this.fov,
    this.rightHanded),
  );

  camera: number[] = $state([...defaultCameraMatrix]);

  // view matrix
  view: number[] = $derived.by(() => {
    const inverted = invertMatrix4(this.camera);
    return inverted ? inverted : [...identity4x4];
  });

  #model: number[] = $state([...identity4x4]);

  get model(): number[] {
    return this.#model;
  }

  set model(matrix) {
    // // compensate in the view matrix for the two states (previous, new)
    // // of the model matrix so that the modelView remains unchanged.
    // const old = this.#model;
    // const scale = matrix[0] / old[0];
    // const difference = [
    //   scale, 0, 0, 0,
    //   0, scale, 0, 0,
    //   0, 0, scale, 0,
    //   0, 0, 0, 1,
    // ];
    // const newCamera = multiplyMatrices4(this.camera, difference);
    // this.camera = newCamera;
    this.camera = [...defaultCameraMatrix];
    this.#model = matrix;
  }

  modelView: number[] = $derived(multiplyMatrices4(this.view, this.model));

  viewBox: [number, number, number, number] = $derived.by(() => {
    const m = invertMatrix4([...this.modelView]);
    if (!m) { return [0, 0, 1, 1]; }
    // get the translation component
    const [, , , , , , , , , , , , x, y, z] = m;
    // remove the translation component
    m[12] = m[13] = m[14] = 0;
    // multiply by unit basis vectors
    const [w, h, d] = multiplyMatrix4Vector3(m, [1, 1, 1]);
    return [-x, -y, w, h];
  });

  vmin: number = $derived(Math.min(this.viewBox[2], this.viewBox[3]));

  vmax: number = $derived(Math.max(this.viewBox[2], this.viewBox[3]));

  uiEpsilon: number = $derived.by(() => this.vmax * WebGLViewport.settings.uiEpsilonFactor);

  snapRadius: number = $derived.by(() => this.vmax * WebGLViewport.settings.snapRadiusFactor);

  clipLine(line: VecLine2 | VecLine3): [[number, number], [number, number]]
    | [[number, number, number], [number, number, number]]
    | undefined {
    return undefined;
  }

  // reset model and camera matrix to aspect fit. the effect is watching:
  // - the current file frame
  #makeModelMatrixEffect(): () => void {
    return $effect.root(() => {
      $effect(() => {
        // console.log("WebGLViewport building new model/camera matrix");
        if (this.viewport.embedding?.graphUpdate.isomorphic) { return; }
        const matrix = graphToMatrix4(this.viewport.embedding?.graph);
        untrack(() => { this.model = matrix; });
      });
      return (): void => { };
    });
  }

  #unsub: (() => void)[] = [];

  constructor(viewport: WebGLViewport) {
    this.viewport = viewport;
    this.#unsub = [this.#makeModelMatrixEffect()];
  }

  reset(): void {
    this.view = [...defaultViewMatrix];
  }

  dealloc(): void {
    this.#unsub.forEach((fn) => fn());
  }
}

