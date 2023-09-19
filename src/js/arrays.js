/**
 * @description Merge two arrays together, output one
 * array that contains the union of integers.
 */
export const combineIntegerSets = (a, b) => {
	const inverted = [];
	a.forEach(i => { inverted[i] = true; });
	b.forEach(i => { inverted[i] = true; });
	return inverted.map((_, i) => i).filter(() => true);
};
/**
 * @description Invert an integer array so that the
 * indices become values and values indices.
 */
export const invertMap = (a) => {
	const inverted = [];
	a.forEach(i => { inverted[i] = true; });
	return inverted;
}
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
