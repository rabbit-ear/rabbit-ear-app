import { includeL, excludeS } from "rabbit-ear/math/general/function.js";
import { intersectLineLine } from "rabbit-ear/math/intersect/intersect.js";
import { makeEdgesVector } from "rabbit-ear/graph/make.js";
import { get } from "svelte/store";
import { writable } from "svelte/store";
import { graph } from "./graph.js";
import { rulerLines } from "./ruler.js";

const intersectGraphLine = (graph, line) => {
	const edgesOrigin = graph.edges_vertices
		.map(v => graph.vertices_coords[v[0]]);
	const edgesVector = makeEdgesVector(graph);
	const edgesLine = edgesVector
		.map((vector, i) => ({ vector, origin: edgesOrigin[i] }));
	return edgesLine
		.map(l => intersectLineLine(line, l, includeL, excludeS))
		.filter(a => a !== undefined);
};

// export const snapPoints = writable([]);

const { subscribe, set, update } = writable([]);
export const snapPoints = {
	subscribe,
	set,
	update,
	updatePoints: () => {
		const g = get(graph);
		const lines = get(rulerLines);
		const intersected = lines
			.flatMap(line => intersectGraphLine(g, line));
		// todo. filter. remove duplicates. build voronoi
		const newPoints = [...g.vertices_coords, ...intersected];
		// console.log("setting snapPoints", newPoints);
		set(newPoints);
	},
};
