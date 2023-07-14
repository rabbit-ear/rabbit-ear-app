import { includeL, excludeS } from "rabbit-ear/math/general/function.js";
import { intersectLineLine } from "rabbit-ear/math/intersect/intersect.js";
import { makeEdgesVector } from "rabbit-ear/graph/make.js";
import { derived } from "svelte/store";
import {
	SNAP_NONE,
	SNAP_GRID,
	SNAP_SMART,
} from "../app/keys.js";
import { Graph } from "./Graph.js";
import { Rulers } from "./Ruler.js";
import { Snapping } from "./App.js";

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

export const SnapPoints = derived(
	[Snapping, Graph, Rulers],
	([$Snapping, $Graph, $Rulers]) => {
		switch ($Snapping) {
		case SNAP_NONE: return [];
		case SNAP_GRID: return [];
		case SNAP_SMART:
			// todo. filter. remove duplicates. build voronoi
			const graph = $Graph;
			const intersected = $Rulers
				.flatMap(line => intersectGraphLine(graph, line));
			return [...graph.vertices_coords, ...intersected];
		}
	},
	[],
);
