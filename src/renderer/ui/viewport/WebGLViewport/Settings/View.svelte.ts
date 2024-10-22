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
