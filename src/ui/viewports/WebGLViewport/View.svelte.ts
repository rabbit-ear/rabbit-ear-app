import { identity4x4, multiplyMatrices4 } from "rabbit-ear/math/matrix4.js";
import type { VecLine2, VecLine3 } from "rabbit-ear/types.js";
import type { View } from "../View";
import { WebGLViewport } from "./WebGLViewport.svelte";
//import { identity4x4, multiplyMatrices4 } from "rabbit-ear/math/matrix4.js";
//import settings from "./ClassSettings.svelte.ts";
//import {
//  viewMatrixRightHanded,
//  viewMatrixLeftHanded,
//} from "../../../../general/matrix.ts";

const defaultViewMatrix: number[] = [
  1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -1.866025, 1,
];

export class WebGLView implements View {
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

  vmax = 2;
  vmin = 2;

  model: number[] = $state([...identity4x4]);

  modelView: number[] = $derived(multiplyMatrices4(this.view, this.model));

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

  dealloc(): void { }
}

