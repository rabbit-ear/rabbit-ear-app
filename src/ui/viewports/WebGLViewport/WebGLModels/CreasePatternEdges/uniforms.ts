import { identity4x4, multiplyMatrices4 } from "rabbit-ear/math/matrix4.js";

/**
 * @description Uniforms must exist so there are protections to ensure
 * that at least some value gets passed.
 * @return {{ [key: string]: WebGLUniform }}
 */
export const makeUniforms = ({
  projectionMatrix,
  modelViewMatrix,
  strokeWidth,
}: { projectionMatrix: number[], modelViewMatrix: number[], strokeWidth: number }) => ({
  u_matrix: {
    func: "uniformMatrix4fv",
    value: multiplyMatrices4(
      projectionMatrix || identity4x4,
      modelViewMatrix || identity4x4,
    ),
  },
  u_strokeWidth: {
    func: "uniform1f",
    value: strokeWidth || 0.05,
  },
});
