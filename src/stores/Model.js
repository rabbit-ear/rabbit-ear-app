import { get } from "svelte/store";
import { writable, derived } from "svelte/store";
import { getFileMetadata } from "rabbit-ear/fold/spec.js";
import {
	flattenFrame,
	getFramesAsFlatArray,
} from "rabbit-ear/fold/frames.js";
import { downloadFile } from "../js/file.js";
import { graphToMatrix2 } from "../js/matrix.js";
import { makeEmptyGraph } from "../js/graph.js";
import { Selection } from "./Select.js";
import { GraphHistory } from "./History.js";
import {
	CameraMatrix,
	ModelMatrix,
} from "./ViewBox.js";

// export const LoadFromFile = (data, type="string") => {
// 	switch (type) {
// 	case "string": break;
// 	case "fold": break;
// 	case "json": break;
// 	case "json": break;
// 	}
// };
/**
 * @description contains the metadata "file_" entries, like "file_title"
 */
export const File = writable({});
/**
 * @description Contains an array of graphs, each being one frame
 * in the FOLD file, where the first item is the top level graph.
 */
export const Frames = writable([makeEmptyGraph()]);
/**
 * @description which frame is currently visible in the main viewport
 */
export const FrameIndex = writable(0);
/**
 * @description
 */
export const FramesRendered = derived(
	Frames,
	($Frames) => {
		// temporarily reassemble frames into a FOLD object for "flattenFrame"
		const FOLD = { ...$Frames[0] };
		const file_frames = $Frames.slice(1);
		if (file_frames.length) { FOLD.file_frames = file_frames; }
		return Array.from(Array($Frames.length))
			.map((_, i) => flattenFrame(FOLD, i));
	},
	[makeEmptyGraph()],
);
/**
 * @description The currently selected (and currently being edited) frame.
 */
export const Graph = derived(
	[FramesRendered, FrameIndex],
	([$FramesRendered, $FrameIndex]) => {
		const newGraph = $FramesRendered[$FrameIndex];
		ModelMatrix.set(graphToMatrix2(newGraph));
		return newGraph;
	},
	makeEmptyGraph(),
);
/**
 *
 */
export const FramesInherit = derived(
	Frames,
	($Frames) => $Frames
		.map(frame => frame.frame_inherit === true),
	[false],
);
/**
 *
 */
export const FrameIsLocked = derived(
	[FramesInherit, FrameIndex],
	([$FramesInherit, $FrameIndex]) => $FramesInherit[$FrameIndex],
	false,
);
/**
 * @description When the graph requires an update but the change
 * results in an isomorphic graph as it relates to VEF, so, likely
 * an edge attribute has been changed like edges_assignment.
 * This still requires a drawing update, but all index pointers, like
 * the indices of selected components don't need to be reset.
 */
export const IsoUpdateFrame = (graph) => {
	// GraphHistory.update(history => [...history, graph]);
	return Frames.update(frames => {
		frames[get(FrameIndex)] = graph;
		return [...frames];
	});
};
/**
 * @description When the graph requires an update and the result
 * is not isomorphic, components will shift around and indices
 * will no longer match, so more things will need to be reset,
 * as opposed to calling "IsoUpdateFrame".
 */
export const UpdateFrame = (graph) => {
	Selection.reset();
	// GraphHistory.update(history => [...history, graph]);
	return IsoUpdateFrame(graph);
};
/**
 * @description If "IsoUpdateFrame" is a small update, "UpdateFrame" is a
 * larger update, "SetFrame" is an even larger update, where the
 * viewport is also reset. This is used when loading a new frame.
 */
export const SetFrame = (graph) => {
	// ModelMatrix.set(graphToMatrix2(graph));
	CameraMatrix.reset();
	return UpdateFrame(graph);
};
/**
 * @description Load a FOLD file and fill all relevant data models,
 * including the file metadata and frames, and reset the current frame
 * to frame 0.
 */
export const LoadFile = (FOLD) => {
	FrameIndex.set(0);
	File.set(getFileMetadata(FOLD));
	Frames.set(getFramesAsFlatArray(FOLD));
};
/**
 *
 */
export const SaveFile = () => {
	const frames = get(Frames);
	const FOLD = { ...get(File), ...frames[0] };
	if (frames.length > 1) {
		FOLD.file_frames = frames.slice(1);
	}
	return FOLD;
};

// const { subscribe, set, update } = writable(makeEmptyGraph());

// const setGraph = (graph) => {
// 	// console.log("setGraph");
// 	Selection.reset();
// 	// GraphHistory.update(history => [...history, graph]);
// 	return set(graph);
// };

// export const Graph = {
// 	subscribe,
// 	update,
// 	set: setGraph,
// 	saveHistory: () => update(graph => {
// 		GraphHistory.update(history => [...history, graph]);
// 		return graph;
// 	}),
// 	// no change to topology
// 	simpleSet: (graph) => {
// 		console.log("simpleSet");
// 		// GraphHistory.update(history => [...history, graph]);
// 		set(graph);
// 	},
// 	revert: () => {
// 		const history = get(GraphHistory);
// 		const previous = history.pop();
// 		GraphHistory.set(history);
// 		Selection.reset();
// 		return set(previous);
// 	},
// 	// methods which modify the graph
// 	// planarize: () => update(g => populate(planarize(g), true)),
// 	// trigger a file-download in the browser
// 	download: () => {
// 		downloadFile(JSON.stringify(get(graph)));
// 		return update(graph => graph);
// 	},
// 	// empty the graph
// 	reset: () => {
// 		ModelMatrix.reset();
// 		CameraMatrix.reset();
// 		return setGraph(makeEmptyGraph())
// 	},
// 	// not on every graph update, only on new file load or something
// 	// of that magnitude, reset the modelMatrix to perfectly enclose the graph
// 	load: (graph) => {
// 		const res = setGraph(graph);
// 		ModelMatrix.set(graphToMatrix2(graph));
// 		CameraMatrix.reset();
// 		return res;
// 	},
// };
