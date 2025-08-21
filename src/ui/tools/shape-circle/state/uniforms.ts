/**
 * Rabbit Ear (c) Kraft
 */
import { identity4x4 } from "rabbit-ear/math/matrix4.js";

/**
 * @description Uniforms must exist so there are protections to ensure
 * that at least some value gets passed.
 * @return {{ [key: string]: WebGLUniform }}
 */
export const makeUniforms = ({
  projectionMatrix,
  modelViewMatrix,
  touchBounds,
  canvas,
  time,
}: {
  projectionMatrix: number[],
  modelViewMatrix: number[],
  touchBounds: [number, number, number, number],
  canvas: HTMLCanvasElement,
  time: number,
}) => ({
  u_projection: {
    func: "uniformMatrix4fv",
    value: projectionMatrix || identity4x4,
  },
  u_modelView: {
    func: "uniformMatrix4fv",
    value: modelViewMatrix || identity4x4,
  },
  u_touchBounds: {
    func: "uniform4fv",
    value: touchBounds,
  },
  u_resolution: {
    func: "uniform2fv",
    value: [canvas.clientWidth, canvas.clientHeight],
  },
  u_time: {
    func: "uniform1f",
    value: time,
  },
});
