import { get } from "svelte/store";
import populate from "rabbit-ear/graph/populate.js";
import { writable, derived } from "svelte/store";
import { Selection } from "./Select.js";
import { downloadFile } from "../js/file.js";
import { graphToMatrix2 } from "../js/matrix.js";
import {
	CameraMatrix,
	ModelMatrix,
} from "./ViewBox.js";
import { GraphHistory } from "./History.js";

const makeEmptyGraph = () => populate({
	vertices_coords: [],
	edges_vertices: [],
	edges_assignment: [],
	edges_foldAngle: [],
	faces_vertices: [],
});

const { subscribe, set, update } = writable(makeEmptyGraph());

const setGraph = (graph) => {
	console.log("setGraph");
	Selection.reset();
	GraphHistory.update(history => [...history, graph]);
	return set(graph);
};

export const Graph = {
	subscribe,
	update,
	set: setGraph,
	// no change to topology
	simpleSet: (graph) => {
		console.log("simpleSet");
		GraphHistory.update(history => [...history, graph]);
		set(graph);
	},
	revert: () => {
		const history = get(GraphHistory);
		const previous = history.pop();
		GraphHistory.set(history);
		Selection.reset();
		return set(previous);
	},
	// methods which modify the graph
	// planarize: () => update(g => populate(planarize(g), true)),
	// trigger a file-download in the browser
	download: () => {
		downloadFile(JSON.stringify(get(graph)));
		return update(graph => graph);
	},
	// empty the graph
	reset: () => {
		ModelMatrix.reset();
		CameraMatrix.reset();
		return setGraph(makeEmptyGraph())
	},
	// not on every graph update, only on new file load or something
	// of that magnitude, reset the modelMatrix to perfectly enclose the graph
	load: (graph) => {
		const res = setGraph(graph);
		ModelMatrix.set(graphToMatrix2(graph));
		CameraMatrix.reset();
		return res;
	},
};

export const UIGraph = writable({});

// export const GraphSelected = derived(
// 	[Graph, Selection], 
// 	([$Graph, $Selection]) => {

// 	},
// 	({}));
