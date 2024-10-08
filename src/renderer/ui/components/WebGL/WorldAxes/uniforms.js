//import { identity4x4 } from "../../math/matrix4.js";
const identity4x4 = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

export const makeUniforms = ({ projectionMatrix, modelViewMatrix, origin, canvas }) => ({
  u_projection: {
    func: "uniformMatrix4fv",
    value: projectionMatrix || identity4x4,
  },
  u_modelView: {
    func: "uniformMatrix4fv",
    value: modelViewMatrix || identity4x4,
  },
  u_origin: {
    func: "uniform3fv",
    value: origin,
  },
  u_resolution: {
    func: "uniform2fv",
    value: [canvas.clientWidth, canvas.clientHeight],
  },
});
