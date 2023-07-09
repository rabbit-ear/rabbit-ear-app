export const invertMap = (a) => {
	const inverted = [];
	a.forEach(i => { inverted[i] = true; });
	return inverted;
}
