import { boundingBox } from "rabbit-ear/graph/boundary.js";
import { cleanNumber } from "rabbit-ear/general/number.js";
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
/**
 *
 */
export const niceNumber = (number, digits = 1) => {
	if (number > 10) { return String(parseInt(number)); }
	if (number > 1) { return number.toFixed(digits); }
	let i = 1;
	for (i = 1; i < 16; i += 1) {
		if (Math.floor(number * Math.pow(10, i)) / Math.pow(10, i) !== 0) { break; }
		// if (parseFloat(number.toFixed(i)) !== 0) { break; }
	}
	// final check to remove trailing zeros
	let result = number.toFixed(i - 1 + digits);
	while (result.length && result[result.length - 1] === "0") {
		result = result.slice(0, -1);
	}
	return result;
};
