import { get } from "svelte/store";
import populate from "rabbit-ear/graph/populate.js";
import { writable } from "svelte/store";
import { selection } from "./select.js";
import { downloadFile } from "../js/file.js";

const makeEmptyGraph = () => populate({
	vertices_coords: [],
	edges_vertices: [],
	edges_assignment: [],
	edges_foldAngle: [],
	faces_vertices: [],
});

const setGraph = (g) => {
	selection.reset();
	const res = set(g);
	return res;
};

const { subscribe, set, update } = writable(makeEmptyGraph());

export const graph = {
	subscribe,
	set: setGraph,
	// no change to topology
	simpleSet: (g) => set(g),
	// methods which modify the graph
	// planarize: () => update(g => populate(planarize(g), true)),
	// trigger a file-download in the browser
	download: () => {
		downloadFile(JSON.stringify(get(graph)));
		return update(g => g);
	},
	// empty the graph
	reset: () => setGraph(makeEmptyGraph()),

	// not on every graph update, only on new file load or something
	// of that magnitude, reset the modelMatrix to perfectly enclose the graph
};

export const uiGraph = writable({});
