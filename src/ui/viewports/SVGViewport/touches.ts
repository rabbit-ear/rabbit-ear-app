import type { Viewport } from "../Viewport.ts";
import { SVGViewport } from "./SVGViewport.svelte.ts";

/**
 * @description Convert a 2D point coordinates from screen/canvas/
 * pixel units, into viewBox units.
 */
export const convertToViewBox = (
  svg: SVGSVGElement,
  [x, y]: [number, number],
): [number, number] => {
  const pt = svg.createSVGPoint();
  pt.x = x;
  pt.y = y;
  // use offsetX/Y for getCTM, use clientX/Y for getScreenCTM()
  const domMatrix = svg.getCTM();
  if (!domMatrix) {
    return [0, 0];
  }
  const svgPoint = pt.matrixTransform(domMatrix.inverse());
  return [svgPoint.x, svgPoint.y];
};

// let scale = 1;
// const unwrap = (point: [number, number]): [number, number] => [
//   (1 / scale) * point[0],
//   (1 / scale) * point[1] * (invertVertical ? -1 : 1),
// ];

export const getSVGViewportPoint = (viewport: Viewport, point: [number, number]): [number, number] => {
  if (!viewport.domElement) { return [0, 0]; }
  // viewport.domElement.tagName === "svg"
  const svg = viewport.domElement as SVGSVGElement;
  const viewBoxCoords = convertToViewBox(svg, point);
  return SVGViewport.settings.rightHanded
    ? [viewBoxCoords[0], -viewBoxCoords[1]]
    : viewBoxCoords;
}

