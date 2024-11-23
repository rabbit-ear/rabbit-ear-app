import {
  identity2x3,
  invertMatrix2,
  multiplyMatrix2Vector2,
  multiplyMatrices2,
} from "rabbit-ear/math/matrix2.js";
import { magnitude2, subtract2 } from "rabbit-ear/math/vector.js";
import {
  invertMatrix4,
  makeMatrix4Scale,
  makeMatrix4Translate,
  multiplyMatrices4,
  multiplyMatrix4Vector3,
  makeOrthographicMatrix4,
  makePerspectiveMatrix4,
} from "rabbit-ear/math/matrix4.js";
import {
  quaternionFromTwoVectors,
  matrix4FromQuaternion,
} from "rabbit-ear/math/quaternion.js";
import { boundingBox } from "rabbit-ear/graph/boundary.js";

/**
 *
 */
export const graphToMatrix2 = (graph = {}, verticalUp = false): number[] => {
  const box = boundingBox(graph);
  // no vertices
  if (!box || !box.span || !box.min) {
    return verticalUp ? [1, 0, 0, 1, 0, -1] : [...identity2x3];
  }
  // degenerate vertices
  const vmax = Math.max(box.span[0], box.span[1]);
  const padding = box.span.map((s) => (s - vmax) / 2);
  if (
    vmax < 1e-6 ||
    !isFinite(box.min[0]) ||
    !isFinite(box.min[1]) ||
    !isFinite(box.span[0]) ||
    !isFinite(box.span[1])
  ) {
    return verticalUp ? [1, 0, 0, 1, 0, -1] : [...identity2x3];
  }
  const translation = [0, 1].map((i) => box.min[i] + padding[i]);
  if (verticalUp) {
    translation[1] = -box.max[1] + padding[1];
  }
  return [vmax, 0, 0, vmax, translation[0], translation[1]];
};

/**
 *
 */
export const viewBoxOrigin = (
  box: [number, number, number, number],
  verticalUp = false,
): [number, number] => (!verticalUp ? [box[0], box[1]] : [box[0], -box[1] - box[3]]);

/**
 * @description The input point is in ModelViewMatrix space,
 * which includes ModelMatrix. But, in the upcoming line we are only
 * applying a change to the CameraMatrix. So, before we modify the
 * CameraMatrix with this point, we need to "remove" the ModelMatrix
 * out of this point (multiply by the inverse of ModelMatrix).
 */
export const getScreenPoint = (
  point: [number, number],
  modelMatrix: number[],
  invertY: boolean,
): [number, number] | undefined => {
  if (point === undefined) {
    return undefined;
  }
  const handedness = invertY ? [1, 0, 0, -1, 0, 0] : [1, 0, 0, 1, 0, 0];
  const inverseModelMatrix = invertMatrix2(modelMatrix);
  const inverseMatrix = !inverseModelMatrix
    ? undefined
    : multiplyMatrices2(inverseModelMatrix, handedness);
  return !inverseMatrix ? point : multiplyMatrix2Vector2(inverseMatrix, point);
};

/**
 * @description sensitivity for pan rotation gesture
 */
const SENSITIVITY = 0.075;

//export const viewMatrixRightHanded: readonly number[] = Object.freeze([
//  1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -1.85, 1,
//]);
//
//export const viewMatrixLeftHanded: readonly number[] = Object.freeze([
//  -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0, -1.85, 1,
//]);

export const viewMatrixRightHanded: readonly number[] = Object.freeze([
  1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
]);

export const viewMatrixLeftHanded: readonly number[] = Object.freeze([
  1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
]);

/**
 * @description Convert a point on a canvas into a 2D vector in the
 * projection space that points from the origin of the canvas
 * to the user-supplied point.
 * This will work for any projection, orthographic or perspective.
 * @param {number[]} point a 2D point in canvas space,
 * typically event.offsetX/event.offsetY.
 * @param {number[]} canvasSize the width and height of the canvas
 * element size in pixels.
 * @param {number[]} projectionMatrix the 4x4 projection matrix currently being used.
 */
export const vectorFromScreenLocation = (
  point: [number, number],
  canvasSize: [number, number],
  projectionMatrix: number[],
): [number, number] => {
  const inverse = invertMatrix4(projectionMatrix);
  // remap each axis of point between 0 and 1.
  // (0, 0) is top left, (1, 1) is bottom right
  const screenPoint: [number, number] = [
    point[0] / canvasSize[0],
    point[1] / canvasSize[1],
  ];
  // a vector from the center of the screen to the screen point.
  // the min/max values of the vector, for each axis, are now between -1 and 1.
  const screenVector = multiplyMatrix2Vector2([-2, 0, 0, 2, 1, -1], screenPoint);
  // the result is the vector from the center of the screen to the pointer,
  // now in corrected world-coordinates (aspect ratio is correct).
  // however it is still in 2D, as a flat screen is really only a 2D surface.
  if (inverse === undefined) {
    return [0, 0];
  }
  const [x, y] = multiplyMatrix4Vector3(inverse, [...screenVector, 1]).slice(0, 2);
  return [x, y];
};

/**
 *
 */
export const rotateViewMatrix = (
  perspective: string,
  viewMatrix: number[],
  vector: [number, number],
  prevVector: [number, number],
): number[] => {
  switch (perspective) {
    case "perspective": {
      const vectors: [number, number, number][] = [
        [
          prevVector[0],
          prevVector[1],
          -SENSITIVITY * Math.atan(1 / magnitude2(prevVector)),
        ],
        [vector[0], vector[1], -SENSITIVITY * Math.atan(1 / magnitude2(vector))],
      ];
      const quaternion = quaternionFromTwoVectors(vectors[0], vectors[1]);
      const matrix = matrix4FromQuaternion(quaternion);
      // return multiplyMatrices4(matrix, viewMatrix);
      // move translation indices out of the matrix, rotate, then put it back in.
      const transIndices = [12, 13, 14];
      const currentTranslation = transIndices.map((i) => viewMatrix[i]);
      transIndices.forEach((i) => {
        viewMatrix[i] = 0;
      });
      const newViewMatrix = multiplyMatrices4(matrix, viewMatrix);
      transIndices.forEach((i, j) => {
        newViewMatrix[i] = currentTranslation[j];
      });
      return newViewMatrix;
    }
    case "orthographic": {
      const translateVector = subtract2(vector, prevVector);
      const translate = makeMatrix4Translate(...translateVector);
      const invertTranslate = invertMatrix4(translate);
      return invertTranslate === undefined
        ? viewMatrix
        : multiplyMatrices4(invertTranslate, viewMatrix);
    }
    default:
      return viewMatrix;
  }
};

/**
 *
 */
export const zoomViewMatrix = (
  perspective: string,
  viewMatrix: number[],
  delta: number,
): number[] => {
  switch (perspective) {
    case "perspective": {
      const translateMatrix = makeMatrix4Translate(0, 0, delta);
      return multiplyMatrices4(translateMatrix, viewMatrix);
    }
    case "orthographic": {
      const scale = 1 + delta;
      const scaleMatrix = makeMatrix4Scale([scale, scale, scale]);
      return multiplyMatrices4(scaleMatrix, viewMatrix);
    }
    default:
      return viewMatrix;
  }
};

/**
 * @description Create a 4x4 projection matrix for either a
 * perspective or orthographic view.
 * @param {[number, number]} size the size of the HTML canvas
 * @param {string} perspective "orthographic" or "perspective"
 * @param {number} fov the field of view (perspective only)
 * @returns {number[]} a 4x4 projection matrix
 */
export const makeProjectionMatrix = (
  [width, height],
  perspective = "perspective",
  fov = 45,
  rightHanded = true,
): number[] => {
  //console.log("rightHanded", rightHanded);
  const Z_NEAR = 0.1;
  const Z_FAR = 20;
  const ORTHO_FAR = -100;
  const ORTHO_NEAR = 100;
  const vmin = Math.min(width, height);
  const padding = [(width - vmin) / vmin / 2, (height - vmin) / vmin / 2];
  const side = padding.map((p) => p + 0.5);
  switch (perspective) {
    case "orthographic":
      return rightHanded
        ? makeOrthographicMatrix4(
            side[1],
            side[0],
            -side[1],
            -side[0],
            ORTHO_FAR,
            ORTHO_NEAR,
          )
        : makeOrthographicMatrix4(
            -side[1],
            side[0],
            side[1],
            -side[0],
            ORTHO_FAR,
            ORTHO_NEAR,
          );
    case "perspective":
    default:
      return rightHanded
        ? makePerspectiveMatrix4(fov * (Math.PI / 180), width / height, Z_NEAR, Z_FAR)
        : multiplyMatrices4(
            makePerspectiveMatrix4(fov * (Math.PI / 180), width / height, Z_NEAR, Z_FAR),
            [1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
          );
  }
};
