/**
 * @description merge two arrays of integers,
 * maintaining their uniqueness.
 */
export const mergeArrays = (a, b) => {
	const inverted = [];
	a.forEach(i => { inverted[i] = true; });
	b.forEach(i => { inverted[i] = true; });
	return inverted.map((_, i) => i).filter(() => true);
};
/**
 *
 */
export const invertMap = (a) => {
	const inverted = [];
	a.forEach(i => { inverted[i] = true; });
	return inverted;
}

export const zipArrays = (a, b) => {
	let zipped = [];
	for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
		if (a[i] !== undefined) zipped.push(a[i]);
		if (b[i] !== undefined) zipped.push(b[i]);
	}
	return zipped;
};
