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
  cursorScreen,
  cursorWorld,
  canvasSize,
}: {
  projectionMatrix: number[],
  modelViewMatrix: number[],
  cursorScreen: [number, number],
  cursorWorld: [number, number],
  canvasSize: [number, number] | undefined,
}) => ({
  u_projection: {
    func: "uniformMatrix4fv",
    value: projectionMatrix || identity4x4,
  },
  u_modelView: {
    func: "uniformMatrix4fv",
    value: modelViewMatrix || identity4x4,
  },
  u_touchScreen: {
    func: "uniform2fv",
    value: cursorScreen,
  },
  u_touchWorld: {
    func: "uniform2fv",
    value: cursorWorld,
  },
  u_resolution: {
    func: "uniform2fv",
    value: canvasSize ?? [0, 0],
  },
});
