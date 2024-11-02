/**
 * @description compute the magnitude a 3D vector.
 * @param {[number, number, number]} v one 3D vector
 * @returns {number} one scalar
 */
export const magnitude = (v: [number, number, number]): number =>
  Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);

/**
 * @description compute the square-magnitude a 3D vector.
 * @param {[number, number, number]} v one 3D vector
 * @returns {number} one scalar
 */
export const magSquared = (v: [number, number, number]): number =>
  v[0] * v[0] + v[1] * v[1] + v[2] * v[2];

/**
 * @description normalize the input vector and return a new vector as a copy.
 * @param {[number, number, number]} v one 3D vector
 * @returns {[number, number, number]} one 3D vector
 */
export const normalize = (v: [number, number, number]): [number, number, number] => {
  const m = magnitude(v);
  return m === 0 ? v : [v[0] / m, v[1] / m, v[2] / m];
};

/**
 * @description scale an input vector by one number, return a copy.
 * @param {[number, number, number]} v one 3D vector
 * @param {number} s one scalar
 * @returns {[number, number, number]} one 3D vector
 */
export const scale = (
  v: [number, number, number],
  s: number,
): [number, number, number] => [v[0] * s, v[1] * s, v[2] * s];

/**
 * @description add two vectors and return the sum as another vector,
 * do not modify the input vectors.
 * @param {[number, number, number]} v one 3D vector
 * @param {[number, number, number]} u one 3D vector
 * @returns {[number, number, number]} one 3D vector
 */
export const add = (
  v: [number, number, number],
  u: [number, number, number],
): [number, number, number] => [v[0] + u[0], v[1] + u[1], v[2] + u[2]];

/**
 * @description subtract the second vector from the first,
 * return the result as a copy.
 * @param {[number, number]} v one 2D vector
 * @param {[number, number]} u one 2D vector
 * @returns {[number, number]} one 2D vector
 */
export const subtract2 = (v: [number, number], u: [number, number]): [number, number] => [
  v[0] - u[0],
  v[1] - u[1],
];

/**
 * @description subtract the second vector from the first,
 * return the result as a copy.
 * @param {[number, number, number]} v one 3D vector
 * @param {[number, number, number]} u one 3D vector
 * @returns {[number, number, number]} one 3D vector
 */
export const subtract = (
  v: [number, number, number],
  u: [number, number, number],
): [number, number, number] => [v[0] - u[0], v[1] - u[1], v[2] - u[2]];

/**
 * @description compute the dot product of two 3D vectors.
 * @param {[number, number, number]} v one 3D vector
 * @param {[number, number, number]} u one 3D vector
 * @returns {number} one scalar
 */
export const dot = (v: [number, number, number], u: [number, number, number]): number =>
  v[0] * u[0] + v[1] * u[1] + v[2] * u[2];

/**
 * @description compute the midpoint of two 3D vectors.
 * @param {[number, number, number]} v one 3D vector
 * @param {[number, number, number]} u one 3D vector
 * @returns {[number, number, number]} one 3D vector
 */
export const midpoint = (
  v: [number, number, number],
  u: [number, number, number],
): [number, number, number] => scale(add(v, u), 0.5);

/**
 * @description the 3D cross product of two 3D vectors
 * @param {[number, number, number]} v one 3D vector
 * @param {[number, number, number]} u one 3D vector
 * @returns {[number, number, number]} one 3D vector
 */
export const cross = (
  v: [number, number, number],
  u: [number, number, number],
): [number, number, number] => [
  v[1] * u[2] - v[2] * u[1],
  v[2] * u[0] - v[0] * u[2],
  v[0] * u[1] - v[1] * u[0],
];

/**
 * @description compute the distance between two 3D vectors
 * @param {[number, number, number]} v one 3D vector
 * @param {[number, number, number]} u one 3D vector
 * @returns {number} one scalar
 */
export const distance = (
  v: [number, number, number],
  u: [number, number, number],
): number => {
  const a = v[0] - u[0];
  const b = v[1] - u[1];
  const c = v[2] - u[2];
  return Math.sqrt(a * a + b * b + c * c);
};

/**
 * @description return a copy of the input vector where
 * each element's sign flipped
 * @param {[number, number, number]} v one 3D vector
 * @returns {[number, number, number]} one 3D vector
 */
export const flip = (v: [number, number, number]): [number, number, number] => [
  -v[0],
  -v[1],
  -v[2],
];

/**
 * @description Resize a vector to 2D, filling any missing values with 0.
 * @param {number[]} vector the vector to resize
 * @returns {[number, number]} a copy of the vector in 2D.
 */
export const resize2 = (vector: number[]): [number, number] => [
  vector[0] || 0,
  vector[1] || 0,
];

/**
 * @description Resize a vector to 3D, filling any missing values with 0.
 * @param {number[]} vector the vector to resize
 * @returns {[number, number, number]} a copy of the vector in 3D.
 */
export const resize3 = (vector: number[]): [number, number, number] => [
  vector[0] || 0,
  vector[1] || 0,
  vector[2] || 0,
];

/**
 * @description Convert hue-saturation-lightness values into
 * three RGB values, each between 0 and 1 (not 0-255).
 * @param {number} hue value between 0 and 360
 * @param {number} saturation value between 0 and 100
 * @param {number} lightness value between 0 and 100
 * @param {number} [alpha] the alpha component from 0 to 1
 * @returns {number[]} three values between 0 and 255, or four
 * if an alpha value is provided, where the fourth is between 0 and 1.
 */
export const hslToRgb = (
  hue: number,
  saturation: number,
  lightness: number,
  alpha?: number,
): number[] => {
  const s = saturation / 100;
  const l = lightness / 100;
  const k = (n: number): number => (n + hue / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number): number =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return alpha === undefined
    ? [f(0) * 255, f(8) * 255, f(4) * 255]
    : [f(0) * 255, f(8) * 255, f(4) * 255, alpha];
};
