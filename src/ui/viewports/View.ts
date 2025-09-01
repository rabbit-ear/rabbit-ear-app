import type { VecLine2, VecLine3 } from "rabbit-ear/types.js";
// import type { Viewport } from "./Viewport";

export interface View {
  // constructor(viewport: Viewport) { }

  // viewport: Viewport;

  // if X is to the right, is the Y axis on top (true) or on bottom (false)?
  // rightHanded: boolean;

  // the 2D dimensions (in pixels) of the drawing canvas
  canvasSize: [number, number] | undefined;

  // "perspective" or "orthographic"
  perspective: string;

  // the projection matrix
  projection: number[];

  // the camera matrix
  // typically this initializes to the identity
  camera: number[];

  // the view matrix
  // this is the inverse of the camera matrix
  view: number[];

  // the model matrix
  // when applied, this aspect fits a model into the unit-scale viewport
  model: number[];

  // the model view matrix (the product of the two)
  modelView: number[];

  // of the two axis-aligned side lengths, the smaller of the two
  vmin: number;

  // of the two axis-aligned side lengths, the larger of the two
  vmax: number;

  // // for SVGs, the viewBox of the model-view matrix, as a list of numbers
  // viewBox: [number, number, number, number];

  // // for SVGs, the viewBox of the model-view matrix, as a space-separated string
  // // this can be set to an SVG element's "viewBox" attribute
  // viewBoxString: string;

  // cameraViewBox: [number, number, number, number];

  // aspectFitViewBox: [number, number, number, number];

  // viewBoxPolygon: [
  //   [number, number],
  //   [number, number],
  //   [number, number],
  //   [number, number]
  // ];

  clipLine(line: VecLine2 | VecLine3): [[number, number], [number, number]]
    | [[number, number, number], [number, number, number]]
    | undefined;

  // reset the camera/view matrix
  reset(): void;

  dealloc(): void;
}
