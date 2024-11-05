import { identity4x4, multiplyMatrices4 } from "rabbit-ear/math/matrix4.js";
import settings from "./ClassSettings.svelte.ts";
import {
  viewMatrixRightHanded,
  viewMatrixLeftHanded,
} from "../../../../general/matrix.ts";

const defaultViewMatrix: number[] = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -5, 1];

export class View {
  projectionMatrix: number[] = $state([...identity4x4]);

  // view matrix
  viewMatrix: number[] = $state([...defaultViewMatrix]);
  //#viewMatrixPre: number[] = $state([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -5, 1]);
  //#handedMatrix: number[] = $derived(
  //  settings.rightHanded ? [...viewMatrixRightHanded] : [...viewMatrixLeftHanded],
  //);
  //#viewMatrix: number[] = $derived(
  //  multiplyMatrices4(this.#handedMatrix, this.#viewMatrixPre),
  //);
  //get viewMatrix(): number[] {
  //  return this.#viewMatrix;
  //}
  //set viewMatrix(value: number[]) {
  //  this.#viewMatrixPre = value;
  //}

  modelMatrix: number[] = $state([...identity4x4]);

  canvasSize: [number, number] = $state([0, 0]);

  perspective: string = $state("orthographic");
  renderStyle: string = $state("creasePattern");
  fov: number = $state(30.25);

  darkMode: boolean = $state(true);
  frontColor: string = $state("#1177FF");
  backColor: string = $state("#ffffff");
  opacity: number = $state(1);

  showFoldedFaceOutlines: boolean = $state(true);
  showFoldedCreases: boolean = $state(false);
  showFoldedFaces: boolean = $state(true);

  vmax = 2;
  vmin = 2;
}
