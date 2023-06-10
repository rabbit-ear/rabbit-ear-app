import { get } from "svelte/store";
import { boundingBox as makeBoundingBox } from "rabbit-ear/math/geometry/polygon.js";
import planarize from "rabbit-ear/graph/planarize.js";
import populate from "rabbit-ear/graph/populate.js";
import splitEdge from "rabbit-ear/graph/splitEdge/index.js";
import { writable } from "svelte/store";
import { selected } from "./select.js";
import { downloadFile } from "../js/file.js";

const makeEmptyGraph = () => populate({
	vertices_coords: [],
	edges_vertices: [],
	edges_assignment: [],
	edges_foldAngle: [],
	faces_vertices: [],
});

// export const graph = writable(makeEmptyGraph());

export const boundingBox = writable({ min: [0, 0], max: [1, 1], span: [1, 1] });

const { subscribe, set, update } = writable(makeEmptyGraph());

export const graph = {
	subscribe,
	set: (g) => {
		// boundingBox.set(makeBoundingBox(get(graph).vertices_coords || []));
		selected.reset();
		return set(g);
	},
	// no change to topology
	simpleSet: (g) => set(g),
	// methods which modify the graph
	planarize: () => update(g => populate(planarize(g), true)),
	// splitSelectedEdges: () => update(g => {
	// 	selected.edges()
	// 		.sort((a, b) => b - a)
	// 		.forEach(edge => splitEdge(g, edge));
	// 	selected.reset();
	// 	return g;
	// }),
	// trigger a file-download in the browser
	download: () => {
		downloadFile(JSON.stringify(get(graph)));
		return update(g => g);
	},
	// empty the graph
	reset: () => set(makeEmptyGraph()),
};

// operations that should modify the graph
// export const planarize = () => {};
// export const addVertex = (point) => {};
// export const addEdgeBetweenVertices = (vertices) => {};
