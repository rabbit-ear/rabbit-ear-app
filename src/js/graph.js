import removeGeometry from "rabbit-ear/graph/remove.js";

export const deleteComponents = (graph, remove) => {
	// const { vertices, edges, faces } = remove;
	// console.log("deleting", vertices, edges, faces);
	// add each vertex's adjacent edges to the delete list
	remove.vertices
		.flatMap((del, v) => del ? graph.vertices_edges[v] : [])
		.forEach(e => { remove.edges[e] = true; });
	// add each vertex's adjacent faces to the delete list
	remove.vertices
		.flatMap((del, v) => del ? graph.vertices_faces[v] : [])
		.forEach(f => { remove.faces[f] = true; });
	//
	const truthy = (arr) => arr
		.map((del, i) => del ? i : undefined)
		.filter(i => i !== undefined);
	["vertices", "edges", "faces"]
		.forEach(key => removeGeometry(graph, key, truthy(remove[key])));
	// removeGeometry(graph, "vertices", vertices);
	// removeGeometry(graph, "vertices", vertices);
	// removeGeometry(graph, "vertices", vertices);
	return graph;
};
