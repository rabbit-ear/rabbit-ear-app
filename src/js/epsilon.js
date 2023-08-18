import { boundingBox } from "rabbit-ear/graph/boundary.js";

/**
 * @param {number} epsilonFactor the factor, a multiple of the
 * longest side length in the graph's bounding box.
 */
export const findEpsilon = ({ vertices_coords }, epsilonFactor = 1e-4) => {
	const bounds = boundingBox({ vertices_coords });
	const sideLength = Math.max(...bounds.span);
	return sideLength * epsilonFactor;
};
