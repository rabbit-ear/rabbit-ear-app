import { untrack } from "svelte";
import { identity4x4, multiplyMatrices4, multiplyMatrix4Vector3 } from "rabbit-ear/math/matrix4.js";
import type { VecLine2, VecLine3 } from "rabbit-ear/types.js";
import type { View } from "../View";
import { WebGLViewport } from "./WebGLViewport.svelte";
import { graphToMatrix4 } from "../../../general/matrix.ts";
//import { identity4x4, multiplyMatrices4 } from "rabbit-ear/math/matrix4.js";
//import settings from "./ClassSettings.svelte.ts";
//import {
//  viewMatrixRightHanded,
//  viewMatrixLeftHanded,
//} from "../../../../general/matrix.ts";
import context from "../../../app/context.svelte.ts";

const defaultViewMatrix: number[] = [
  1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -1.866025, 1,
];

export class WebGLView implements View {
  viewport: WebGLViewport;

  rightHanded: boolean = $derived(context.ui.settings.rightHanded.value ?? true);

  canvasSize: [number, number] = $state([0, 0]);

  perspective: string = $state("orthographic");

  fov: number = $state(30.25);

  projection: number[] = $state([...identity4x4]);

  camera: number[] = [...identity4x4];

  // view matrix
  view: number[] = $state([...defaultViewMatrix]);
  //#viewMatrixPre: number[] = $state([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -5, 1]);
  //#handedMatrix: number[] = $derived(
  //  settings.rightHanded ? [...viewMatrixRightHanded] : [...viewMatrixLeftHanded],
  //);
  //#viewMatrix: number[] = $derived(
  //  multiplyMatrices4(this.#handedMatrix, this.#viewMatrixPre),
  //);

  model: number[] = $state([...identity4x4]);

  modelView: number[] = $derived(multiplyMatrices4(this.view, this.model));

  viewBox: [number, number, number, number] = $derived.by(() => {
    const m = [...this.modelView];
    // get the translation component
    const [, , , , , , , , , , , x, y, z] = m;
    // remove the translation component
    m[12] = m[13] = m[14] = 0;
    // multiply by unit basis vectors
    const [w, h, d] = multiplyMatrix4Vector3(m, [1, 1, 1]);
    return [x, y, w, h];
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

  reset(): void {
    this.view = [...defaultViewMatrix];
  }

  // reset model and camera matrix to aspect fit. the effect is watching:
  // - the current file frame
  // - this.rightHanded
  #makeModelMatrixEffect(): () => void {
    return $effect.root(() => {
      $effect(() => {
        console.log("WebGLViewport building new model/camera matrix");
        const matrix = graphToMatrix4(this.viewport.model?.graph, this.rightHanded);
        untrack(() => {
          this.model = matrix;
          this.camera = [...identity4x4];
          // this.camera = [...defaultViewMatrix];
        });
      });
      return (): void => { };
    });
  }

  #unsub: (() => void)[] = [];

  constructor(viewport: WebGLViewport) {
    this.viewport = viewport;
    this.#unsub = [this.#makeModelMatrixEffect()];
  }

  dealloc(): void { }
}

