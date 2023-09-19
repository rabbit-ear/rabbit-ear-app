import { boundingBox } from "rabbit-ear/graph/boundary.js";
/**
 * @description Scale up an epsilon value to become a factor of
 * the extent of a list of vertices. The default epsilon factor
 * is 1e-4, meaning if the bounding box of vertices is 10,000 long,
 * the epsilon will be 1.
 * @param {number} epsilonFactor the factor, to be multiplied by
 * the longest side length in the graph's bounding box.
 */
export const findEpsilon = ({ vertices_coords }, epsilonFactor = 1e-4) => {
	const bounds = boundingBox({ vertices_coords });
	const sideLength = Math.max(...bounds.span);
	return sideLength * epsilonFactor;
};
