import { untrack } from "svelte";
import {
  identity2x3,
  invertMatrix2,
  multiplyMatrices2,
  multiplyMatrix2Vector2,
  //makeMatrix2Translate,
  //makeMatrix2UniformScale,
} from "rabbit-ear/math/matrix2.js";
import type { VecLine2 } from "rabbit-ear/types.js";
import type { SVGViewport } from "./SVGViewport.svelte.ts";
import { clipLineInPolygon } from "./clip.ts";
import { viewBoxOrigin, graphToMatrix2 } from "../../../general/matrix.ts";
import context from "../../../app/context.svelte.ts";

export class View {
  viewport: SVGViewport;
  // is the Y axis on top (true) or on bottom (false)?
  rightHanded: boolean = $derived(context.ui?.settings.rightHanded.value ?? true);

  canvasSize: [number, number] | undefined = $state(undefined);

  // camera = $state([...identity2x3]);
  // #model = $state([...identity2x3]);

  get model(): number[] {
    return this.viewport.modelView.model;
  }

  set model(matrix) {
    const old = this.viewport.modelView.model;
    const scale = matrix[0] / old[0];
    const x = (matrix[4] - old[4]) / old[0];
    const y = (matrix[5] - old[5]) / old[0];
    const difference = [scale, 0, 0, scale, x, y];
    const newCamera = multiplyMatrices2(this.viewport.modelView.camera, difference);
    this.viewport.modelView.camera = newCamera;
    this.viewport.modelView.model = matrix;
  }

  view = $derived.by(() => {
    const inverted = invertMatrix2(this.viewport.modelView.camera);
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

  // a UI touch event, coming from a pointer device, will have some
  // built-in error correcting (like snapping, for example), and this behavior
  // is zoom-level dependent. Use this variable to get an appropriate error-
  // correcting value.
  uiEpsilon: number = $derived.by(() => this.vmax * this.viewport.constructor.settings.uiEpsilonFactor.value);

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
        const matrix = graphToMatrix2(this.viewport.model?.graph, this.rightHanded);
        untrack(() => {
          this.viewport.modelView.model = matrix;
          this.viewport.modelView.camera = [...identity2x3];
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

  clipLine(line: VecLine2): [number, number][] | undefined {
    return clipLineInPolygon(line, this.viewBoxPolygon);
  }

  resetCamera(): void {
    this.viewport.modelView.camera = [...identity2x3];
  }

  // todo: not sure that this is ever being called.
  resetModel(): void {
    console.log("reset model");
    this.viewport.modelView.model = [...identity2x3];
  }

  reset(): void {
    this.resetCamera();
    this.resetModel();
  }

  dealloc(): void {
    this.#unsub.forEach((fn) => fn());
  }
}

