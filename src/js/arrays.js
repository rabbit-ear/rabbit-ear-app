/**
 * @description Create the union of two arrays of objects,
 * the result will be written into the first array, and the first
 * array will be returned. Duplicate values in the second array
 * will not be transferred. However this does not check the first
 * array, in the case that there are duplicate values inside of it.
 */
export const assignLists = (a, b) => {
	const hash = {};
	a.forEach(value => { hash[value] = true; });
	b.filter(value => !hash[value]).forEach(value => a.push(value));
	return a;
};
/**
 * @description Zip two arrays together, starting with array "a",
 * take one from "a", then one from "b", one from "a", repeat.
 */
export const zipArrays = (a, b) => {
	let zipped = [];
	for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
		if (a[i] !== undefined) zipped.push(a[i]);
		if (b[i] !== undefined) zipped.push(b[i]);
	}
	return zipped;
};
/**
 *
 */
export const arrayIntersection = (a = [], b = []) => a
	.filter(value => b.includes(value));
