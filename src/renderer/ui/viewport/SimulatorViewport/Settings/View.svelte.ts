import { identity4x4 } from "rabbit-ear/math/matrix4.js";
import AppSettings from "../../../../app/Settings.svelte.ts";

const defaultViewMatrix: number[] = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -1.86, 1];

export class View {
  // is the Y axis on top (true) or on bottom (false)?
  rightHanded: boolean = $derived(AppSettings.rightHanded);

  projectionMatrix: number[] = $state([...identity4x4]);

  // view matrix
  viewMatrix: number[] = $state([...defaultViewMatrix]);

  modelMatrix: number[] = $state([...identity4x4]);

  canvasSize: [number, number] = $state([0, 0]);

  perspective: string = $state("orthographic");
  renderStyle: string = $state("creasePattern");
  fov: number = $state(30.25);

  vmax = 2;
  vmin = 2;
}
