import { get } from "svelte/store";
import { boundingBox as makeBoundingBox } from "rabbit-ear/math/geometry/polygon.js";
import planarize from "rabbit-ear/graph/planarize.js";
import populate from "rabbit-ear/graph/populate.js";
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
	planarize: () => update(g => populate(planarize(g), true)),
	download: () => {
		downloadFile(JSON.stringify(get(graph)));
		return update(g => g);
	},
	reset: () => set(makeEmptyGraph()),
};

export const metadata = writable({
	newestVertex: undefined, // {number} index in vertices_coords.
});

// operations that should modify the graph
// export const planarize = () => {};
// export const addVertex = (point) => {};
// export const addEdgeBetweenVertices = (vertices) => {};

