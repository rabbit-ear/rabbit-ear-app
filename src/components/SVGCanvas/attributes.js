
export const makeSelectedAttributes = (graph, selected = [], highlighted = []) => {
	if (!graph) { return []; }

	const selectedHash = {};
	selected.forEach(e => { selectedHash[e] = true; });

	const highlightedHash = [];
	highlighted.forEach(i => { highlightedHash[i] = true; });

	return (graph.edges_vertices || []).map((_, i) => [
		selectedHash[i] ? "selected" : undefined,
		highlightedHash[i] ? "highlighted" : undefined,
	].filter(a => a !== undefined).join(" "))
		.map(className => (className ? { class: className } : {}));
};
