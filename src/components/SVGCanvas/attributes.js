/**
 *
 */
export const joinSelectedHighlighted = (selected = [], highlighted = []) => {
	const hash = {};
	selected.forEach(i => hash[i] = [])
	highlighted.forEach(i => hash[i] = []);
	selected.forEach(i => hash[i].push("selected"));
	highlighted.forEach(i => hash[i].push("highlighted"));
	return hash;
};
