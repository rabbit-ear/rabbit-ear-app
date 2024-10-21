import { identity4x4 } from "rabbit-ear/math/matrix4.js";

const defaultViewMatrix = (): number[] => [
  1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -5, 1,
];

export class View {
  projectionMatrix: number[] = $state([...identity4x4]);
  viewMatrix: number[] = $state(defaultViewMatrix());
  modelMatrix: number[] = $state([...identity4x4]);
  canvasSize: [number, number] = $state([0, 0]);
  perspective: string = $state("perspective");

  vmax = 2;
  vmin = 2;
}
