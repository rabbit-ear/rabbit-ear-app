import { untrack } from "svelte";
import {
  identity2x3,
  invertMatrix2,
  multiplyMatrices2,
  multiplyMatrix2Vector2,
  //makeMatrix2Translate,
  //makeMatrix2UniformScale,
} from "rabbit-ear/math/matrix2.js";
import type { SVGViewport } from "./SVGViewport.svelte.ts";
import { viewBoxOrigin, graphToMatrix2 } from "../../../general/matrix.ts";
import context from "../../../app/context.svelte.ts";

export class View {
  viewport: SVGViewport;
  // is the Y axis on top (true) or on bottom (false)?
  rightHanded: boolean = $derived(context.ui?.settings.rightHanded.value ?? true);

  canvasSize: [number, number] | undefined = $state(undefined);

  camera = $state([...identity2x3]);

  #model = $state([...identity2x3]);
  get model(): number[] {
    return this.#model;
  }
  set model(matrix) {
    const old = this.#model;
    const scale = matrix[0] / old[0];
    const x = (matrix[4] - old[4]) / old[0];
    const y = (matrix[5] - old[5]) / old[0];
    const difference = [scale, 0, 0, scale, x, y];
    const newCamera = multiplyMatrices2(this.camera, difference);
    this.camera = newCamera;
    this.#model = matrix;
  }

  view = $derived.by(() => {
    const inverted = invertMatrix2(this.camera);
    return inverted ? inverted : [...identity2x3];
  });

  modelView = $derived(multiplyMatrices2(this.model, this.view));

  viewBox: [number, number, number, number] = $derived.by(() => {
    const m = [...this.modelView];
    // get the translation component
    const [, , , , x, y] = m;
    // remove the translation component
    m[4] = m[5] = 0;
    // multiply by unit basis vectors
    const [w, h] = multiplyMatrix2Vector2(m, [1, 1]);
    return [x, y, w, h];
  });

  vmin: number = $derived(Math.min(this.viewBox[2], this.viewBox[3]));
  vmax: number = $derived(Math.max(this.viewBox[2], this.viewBox[3]));

  viewBoxString = $derived(this.viewBox.join(" "));

  #cameraOrigin = $derived.by(() => viewBoxOrigin(this.viewBox, this.rightHanded));

  cameraViewBox: [number, number, number, number] = $derived.by(() => [
    this.#cameraOrigin[0],
    this.#cameraOrigin[1],
    this.viewBox[2],
    this.viewBox[3],
  ]);

  aspectFitViewBox = $derived.by(() => {
    if (!this.canvasSize) {
      return this.cameraViewBox;
    }
    const box = [...this.cameraViewBox];
    const canvasAspect = this.canvasSize[0] / this.canvasSize[1];
    const viewBoxAspect = this.viewBox[2] / this.viewBox[3];
    if (canvasAspect < viewBoxAspect) {
      // canvas is taller than view box
      const newHeight = box[3] / canvasAspect;
      box[1] -= (newHeight - box[3]) / 2;
      box[3] = newHeight;
    } else if (canvasAspect > viewBoxAspect) {
      // canvas is wider than view box
      const width = box[2] * canvasAspect;
      box[0] -= (width - box[2]) / 2;
      box[2] = width;
    }
    return box;
  });

  viewBoxPolygon: [number, number][] = $derived([
    [this.aspectFitViewBox[0], this.aspectFitViewBox[1]],
    [this.aspectFitViewBox[0] + this.aspectFitViewBox[2], this.aspectFitViewBox[1]],
    [
      this.aspectFitViewBox[0] + this.aspectFitViewBox[2],
      this.aspectFitViewBox[1] + this.aspectFitViewBox[3],
    ],
    [this.aspectFitViewBox[0], this.aspectFitViewBox[1] + this.aspectFitViewBox[3]],
  ]);

  // reset model and camera matrix to aspect fit. the effect is watching:
  // - the current file frame
  // - this.rightHanded
  #makeModelMatrixEffect(): () => void {
    return $effect.root(() => {
      $effect(() => {
        console.log("SVGViewport view effect");
        const matrix = graphToMatrix2(this.viewport.model?.fold, this.rightHanded);
        untrack(() => {
          this.#model = matrix;
          this.camera = [...identity2x3];
        });
      });
      return (): void => { };
    });
  }

  #unsub: (() => void)[] = [];

  constructor(viewport: SVGViewport) {
    this.viewport = viewport;
    this.#unsub = [this.#makeModelMatrixEffect()];
  }

  resetCamera(): void {
    this.camera = [...identity2x3];
  }

  // todo: not sure that this is ever being called.
  resetModel(): void {
    console.log("reset model");
    this.#model = [...identity2x3];
  }

  reset(): void {
    this.resetCamera();
    this.resetModel();
  }

  dealloc(): void {
    this.#unsub.forEach((fn) => fn());
  }
}

