import { identity4x4, multiplyMatrices4 } from "rabbit-ear/math/matrix4.js";
import { parseColorToWebGLColor } from "rabbit-ear/webgl/general/colors.js";

/**
 * @description Uniforms must exist so there are protections to ensure
 * that at least some value gets passed.
 * @return {{ [key: string]: WebGLUniform }}
 */
export const makeUniforms = ({
  projectionMatrix,
  modelViewMatrix,
  frontColor,
  backColor,
  outlineColor,
  strokeWidth,
  opacity,
}: {
  projectionMatrix: number[],
  modelViewMatrix: number[],
  frontColor: number[],
  backColor: number[],
  outlineColor: number[],
  strokeWidth: number,
  opacity: number,
}) => ({
  u_matrix: {
    func: "uniformMatrix4fv",
    value: multiplyMatrices4(
      projectionMatrix || identity4x4,
      modelViewMatrix || identity4x4,
    ),
  },
  u_projection: {
    func: "uniformMatrix4fv",
    value: projectionMatrix || identity4x4,
  },
  u_modelView: {
    func: "uniformMatrix4fv",
    value: modelViewMatrix || identity4x4,
  },
  u_frontColor: {
    func: "uniform3fv",
    value: parseColorToWebGLColor(frontColor || "gray"),
  },
  u_backColor: {
    func: "uniform3fv",
    value: parseColorToWebGLColor(backColor || "white"),
  },
  u_outlineColor: {
    func: "uniform3fv",
    value: parseColorToWebGLColor(outlineColor || "black"),
  },
  u_strokeWidth: {
    func: "uniform1f",
    value: strokeWidth !== undefined ? strokeWidth : 0.05,
  },
  u_opacity: {
    func: "uniform1f",
    value: opacity !== undefined ? opacity : 1,
  },
});
