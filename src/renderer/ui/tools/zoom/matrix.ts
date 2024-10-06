import {
  makeMatrix2UniformScale,
  multiplyMatrices2,
  determinant2,
  makeMatrix2Translate,
} from "rabbit-ear/math/matrix2.js";
import type { SVGViewport } from "../../viewport/SVGViewport/SVGViewport.svelte.ts";
import { getScreenPoint } from "../../../general/matrix.ts";

/**
 *
 */
export const zoomCameraMatrix = (
  camera: number[],
  scale: number,
  origin: [number, number],
) => {
  // the input point is in ModelViewMatrix space,
  // which includes ModelMatrix. But, in the upcoming line we are only
  // applying a change to the CameraMatrix. So, before we modify the
  // CameraMatrix with this point, we need to "remove" the ModelMatrix
  // out of this point (multiply by the inverse of ModelMatrix).
  const matrix = makeMatrix2UniformScale(scale, origin);

  // safety check.
  // if the determininat is too small, return unchanged matrix
  // the reason is because the viewMatrix is built from the
  // inverse of this matrix, a bad det makes an invalid inverse.
  const newMatrix = multiplyMatrices2(camera, matrix);
  const det = determinant2(newMatrix);
  if (Math.abs(det) < 1e-11) {
    return [1e-5, 0, 0, 1e-5, camera[4], camera[5]];
  }
  if (Math.abs(det) > 1e11) {
    return [1e5, 0, 0, 1e5, 0, 0];
  }
  return newMatrix;
};

/**
 *
 */
export const panCameraMatrix = (camera: number[], translate: [number, number]) => {
  const matrix = makeMatrix2Translate(translate[0], translate[1]);
  return multiplyMatrices2(camera, matrix);
};

/**
 *
 */
export const wheelEventZoomMatrix = (
  viewport: SVGViewport,
  { point, deltaY }: { point: [number, number]; deltaY: number },
) => {
  const scaleOffset = deltaY / 333;
  const scale = 1 - scaleOffset;
  const screenPoint = getScreenPoint(point, viewport.view.model);
  const origin: [number, number] = screenPoint ? screenPoint : [0, 0];
  origin[1] *= (viewport.view.rightHanded ? -1 : 1);
  viewport.view.camera = zoomCameraMatrix(viewport.view.camera, scale, origin);
};

/**
 *
 */
export const wheelPanMatrix = (
  viewport: SVGViewport,
  { deltaX, deltaY }: { deltaX: number; deltaY: number },
) => {
  const invertedY = viewport.view.rightHanded;
  const touchScale = -1 / 300;
  const impliedScale = viewport.view.modelView[0];
  const translate: [number, number] = [
    deltaX * touchScale * impliedScale,
    //deltaY * touchScale * impliedScale * (viewport.view.invertY ? -1 : 1),
    deltaY * touchScale * impliedScale,
  ];
  viewport.view.camera = panCameraMatrix(viewport.view.camera, translate);
};
