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
