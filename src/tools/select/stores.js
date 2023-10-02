import { boundingBox } from "rabbit-ear/math/polygon.js";
import {
	writable,
	derived,
} from "svelte/store";
import { Selection } from "../../stores/Select.js";
import { Highlight } from "../../stores/UI.js";
import { CreasePattern } from "../../stores/Model.js";
import { zipArrays } from "../../js/arrays.js";
import { nearest } from "rabbit-ear/graph/nearest.js";

export const SELECT_VERTEX = "vertices";
export const SELECT_EDGE = "edges";
export const SELECT_FACE = "faces";

export const vefName = {
	[SELECT_VERTEX]: "vertices",
	[SELECT_EDGE]: "edges",
	[SELECT_FACE]: "faces",
};
/**
 * @description for the UI. which tool step is currently in progress
 * based on the collected touch data.
 */
export const ElementSelect = writable(SELECT_EDGE);
const ElementSelectSet = ElementSelect.set;
ElementSelect.set = (e) => {
	Selection.reset();
	return ElementSelectSet(e);
};

export const Move = writable(undefined);
export const Press = writable(undefined);
export const Drag = writable(undefined);
export const Release = writable(undefined);

export const SelectionRect = derived(
	[Press, Drag, Release],
	([$Press, $Drag, $Release]) => boundingBox([$Press, $Drag, $Release]
		.filter(a => a !== undefined)),
	undefined,
);

export const HighlightHover = derived(
	[CreasePattern, Move],
	([$CreasePattern, $Move]) => {
		const nears = nearest($CreasePattern, $Move);
		Highlight.reset();
		Highlight.addVertices([nears.vertex]);
		Highlight.addEdges([nears.edge]);
		Highlight.addFaces([nears.face]);
	},
	{},
);

export const reset = () => {
	Move.set(undefined);
	Drag.set(undefined);
	Press.set(undefined);
	Release.set(undefined);
};

let unsub;

export const subscribe = () => {
	unsub = HighlightHover.subscribe(() => {});
};

export const unsubscribe = () => {
	if (unsub) { unsub(); }
	reset();
};
