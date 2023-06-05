import removeGeometry from "rabbit-ear/graph/remove.js";
/**
 *
 */
export const deleteComponents = (graph, remove) => {
	// add each vertex's adjacent edges to the delete list
	remove.vertices
		.flatMap((del, v) => del ? graph.vertices_edges[v] : [])
		.forEach(e => { remove.edges[e] = true; });
	// add each vertex's adjacent faces to the delete list
	remove.vertices
		.flatMap((del, v) => del ? graph.vertices_faces[v] : [])
		.forEach(f => { remove.faces[f] = true; });
	// convert object into array of indices. these will be sorted.
	const truthy = (arr) => arr
		.map((del, i) => del ? i : undefined)
		.filter(i => i !== undefined);
	// remove
	["vertices", "edges", "faces"]
		.forEach(key => removeGeometry(graph, key, truthy(remove[key])));
	return graph;
};
