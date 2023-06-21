import { subgraph } from "rabbit-ear/graph/subgraph.js";
import { invertMap } from "rabbit-ear/graph/maps.js";
import {
	filterKeysWithPrefix,
	filterKeysWithSuffix,
} from "rabbit-ear/fold/spec.js";

const remapKey = (graph, key, indexMap) => {
	const invertedMap = invertMap(indexMap);
	// update every component that points to vertices_coords
	// these arrays do not change their size, only their contents
	filterKeysWithSuffix(graph, key)
		.forEach(sKey => graph[sKey]
			.forEach((_, ii) => graph[sKey][ii]
				.forEach((v, jj) => { graph[sKey][ii][jj] = indexMap[v]; })));
	// if a key was not included in indexMap for whatever reason,
	// it will be registered as "undefined". remove these.
	// the upcoming "prefix" step will automatically do this as well.
	filterKeysWithSuffix(graph, key)
		.forEach(sKey => graph[sKey]
			.forEach((_, ii) => {
				graph[sKey][ii] = graph[sKey][ii].filter(a => a !== undefined);
			}));
	// set the top-level arrays
	filterKeysWithPrefix(graph, key).forEach(prefix => {
		graph[prefix] = invertedMap.map(old => graph[prefix][old]);
	});
};

// turn all component indices into numbers between 0 and N-1.
// this will also remove all holes in any arrays.
export const normalize = (graph) => {
	const maps = { vertices: [], edges: [], faces: [] };		
	let v = 0;
	let e = 0;
	let f = 0;
	graph.vertices_coords.forEach((_, i) => { maps.vertices[i] = v++; });
	graph.edges_vertices.forEach((_, i) => { maps.edges[i] = e++; });
	graph.faces_vertices.forEach((_, i) => { maps.faces[i] = f++; });
	remapKey(graph, "vertices", maps.vertices);
	remapKey(graph, "edges", maps.edges);
	remapKey(graph, "faces", maps.faces);
	return graph;
};

export const subgraphWithVertices = (graph, vertices = []) => {
	// console.log("graph", graph);
	// console.log("vertices", vertices);
	// these will be in the form of index:value number:boolean.
	// later to be converted into a list of indices.
	const components = { vertices: [], edges: [] };
	vertices.forEach(v => { components.vertices[v] = true; });
	if (graph.vertices_edges) {
		components.vertices
			.forEach((_, v) => graph.vertices_edges[v]
				.forEach(e => { components.edges[e] = true; }));
	}
	if (graph.edges_vertices) {
		components.edges
			.forEach((_, e) => graph.edges_vertices[e]
				.forEach(v => { components.vertices[v] = true; }));
	}
	const sub = subgraph(graph, {
		vertices: components.vertices
			.map((v, i) => v ? i : undefined)
			.filter(a => a !== undefined),
		edges: components.edges
			.map((e, i) => e ? i : undefined)
			.filter(a => a !== undefined),
	});
	return sub;
};
