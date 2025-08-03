import { boundingBox } from "rabbit-ear/graph/boundary.js";
import { cleanNumber as CleanNumber } from "rabbit-ear/general/number.js";
import { Sqrt2LookupToFloat } from "./sqrt2.js";

/**
 * @description Scale up an epsilon value to become a factor of
 * the extent of a list of vertices. The default epsilon factor
 * is 1e-4, meaning if the bounding box of vertices is 10,000 long,
 * the epsilon will be 1.
 * @param {FOLD} graph a FOLD object
 * @param {number} epsilonFactor the factor, to be multiplied by
 * the longest side length in the graph's bounding box.
 */
export const findEpsilon = ({ vertices_coords }, epsilonFactor = 1e-4): number => {
  const bounds = boundingBox({ vertices_coords });
  const sideLength = Math.max(...bounds.span);
  return sideLength * epsilonFactor;
};

/**
 * @description "Lossless" cleaning of a number to a level of precision,
 * by removing or correcting the noise at the end of the floating point number.
 * If the level of precision is 7 and the number is 1.0000000084242312,
 * this method will return 1. Additionally, provide a sqrt2 lookup table,
 * and 0.7071067811000000 will be converted into 0.7071067811865476.
 * The number will be compared against all whole numbers, as well as
 * all numbers in the Sqrt2Lookup table.
 */
export const cleanNumber = (num: number, precision = 7, lookup = {}): number => {
  const n = CleanNumber(num, precision);
  if (!lookup) {
    return n;
  }
  const str = n.toFixed(precision);
  if (lookup[str]) {
    const [a, b, c] = lookup[str];
    return Sqrt2LookupToFloat(a, b, c);
  }
  return n;
};

/**
 * @description Pretty print a floating point number, where the exact
 * value does not matter, by iterating through the leading zeros until
 * the first digit is found. You can also specify how many digits to
 * include, meaning, non-zero digits.
 * So for example, 0.0002458236492835 becomes 0.0002.
 */
export const niceNumber = (num: number, digits = 1): string => {
  if (num > 10) {
    return String(parseInt(num));
  }
  if (num > 1) {
    return num.toFixed(digits);
  }
  let i = 1;
  for (i = 1; i < 16; i += 1) {
    if (Math.floor(num * Math.pow(10, i)) / Math.pow(10, i) !== 0) {
      break;
    }
    // if (parseFloat(number.toFixed(i)) !== 0) { break; }
  }
  // final check to remove trailing zeros
  let result = num.toFixed(i - 1 + digits);
  while (result.length && result[result.length - 1] === "0") {
    result = result.slice(0, -1);
  }
  return result;
};

/**
 * @description just learned this:
 * if edge endpoints are floating point values with 12-16 digits,
 * the rendering is MUCH slower than if the same edges' endpoints
 * are integers.
 * cut double precision to float precision for rendering speed
 */
export const svgNumber = (num: number): string => {
  const rawString = num.toString();
  if (rawString.length < 7) {
    return rawString;
  }
  const cleaned = CleanNumber(num, 7).toString();
  if (cleaned.length < 7) {
    return cleaned;
  }
  return num.toFixed(4);
  // return niceNumber(number, 4).toString();
};

