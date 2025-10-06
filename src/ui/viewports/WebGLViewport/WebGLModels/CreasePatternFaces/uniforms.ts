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
  cpColor,
}: { projectionMatrix: number[], modelViewMatrix: number[], cpColor: string }) => ({
  u_matrix: {
    func: "uniformMatrix4fv",
    value: multiplyMatrices4(
      projectionMatrix || identity4x4,
      modelViewMatrix || identity4x4,
    ),
  },
  u_cpColor: {
    func: "uniform3fv",
    value: parseColorToWebGLColor(cpColor || "white"),
  },
});
