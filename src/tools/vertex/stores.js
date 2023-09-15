import {
	writable,
	derived,
} from "svelte/store";
import {
	add2,
	subtract2,
} from "rabbit-ear/math/vector.js";
import { subgraphWithVertices } from "rabbit-ear/graph/subgraph.js";
import normalize from "rabbit-ear/graph/normalize.js";
import {
	snapToPoint,
	snapToVertex,
} from "../../js/snap.js";
import { Graph } from "../../stores/Model.js";
import { UIGraph } from "../../stores/UI.js";
// import { Selection } from "../../stores/Select.js";

export const Move = writable(undefined);
export const Drag = writable(undefined);
export const Press = writable(undefined);

export const MoveCoords = derived(
	Move,
	($Move) => snapToVertex($Move).coords,
	undefined,
);

// todo when shift snap to ruler line
export const DragCoords = derived(
	Drag,
	($Drag) => snapToPoint($Drag),
	undefined,
);

const PressSnap = derived(
	Press,
	($Press) => snapToVertex($Press),
	{},
);

export const PressVertex = derived(
	PressSnap,
	($PressSnap) => $PressSnap.vertex,
	undefined,
);

export const PressCoords = derived(
	PressSnap,
	($PressSnap) => $PressSnap.coords,
	undefined,
);

export const DragVector = derived(
	[DragCoords, PressCoords],
	([$DragCoords, $PressCoords]) => (!$DragCoords || !$PressCoords)
		? [0, 0]
		: subtract2($DragCoords, $PressCoords),
	[0, 0],
);

export const GraphPreview = derived(
	[DragVector, PressVertex, Graph],
	([$DragVector, $PressVertex, $Graph]) => {
		if ($PressVertex === undefined) {
			return UIGraph.set({});
		}
		const subgraph = subgraphWithVertices($Graph, [$PressVertex]);
		[$PressVertex].forEach(v => {
			subgraph.vertices_coords[v] = add2(subgraph.vertices_coords[v], $DragVector);
		});
		normalize(subgraph);
		UIGraph.set({ ...subgraph });
	},
	undefined,
);

// export const GraphPreview = derived(
// 	[DragVector, Selection, Graph],
// 	([$DragVector, $Selection, $Graph]) => {
// 		const selectedVertices = $Selection.vertices;
// 		const subgraph = subgraphWithVertices($Graph, selectedVertices);
// 		selectedVertices.forEach(v => {
// 			subgraph.vertices_coords[v] = add2(subgraph.vertices_coords[v], $DragVector);
// 		});
// 		normalize(subgraph);
// 		UIGraph.set({ ...subgraph });
// 	},
// 	undefined,
// );

export const reset = () => {
	Move.set(undefined);
	Press.set(undefined);
	Drag.set(undefined);
};

let unsub;

export const subscribe = () => {
	unsub = GraphPreview.subscribe(() => {});
};

export const unsubscribe = () => {
	if (unsub) { unsub(); }
	reset();
};
