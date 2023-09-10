import {
	writable,
	derived,
} from "svelte/store";
import { zipArrays } from "../../js/arrays.js";

/**
 * @description get the selected components inside the SelectionRect
 */
export const getSelected = () => {
	// const graphValue = get(Graph);
	// const vb = get(ViewBox);
	// const vmax = Math.max(vb[2], vb[3]);
	// const degenerateSelection = get(SelectionRect) === undefined
	// 	|| Math.max(...get(SelectionRect).span) < vmax * 0.01;
	// const nears = degenerateSelection
	// 	? getSelectedFromPoint(graphValue, get(Releases)[get(Releases).length - 1])
	// 	: getSelectedFromRect(graphValue, get(SelectionRect));
	// return nears[vefName[get(ElementSelect)]];
};

export const Move = writable(undefined);
export const Presses = writable([]);
export const Releases = writable([]);

export const Touches = derived(
	[Move, Presses, Releases],
	([$Move, $Presses, $Releases]) => zipArrays($Presses, $Releases)
		.concat([$Move])
		.filter(a => a !== undefined),
	[],
);

export const SelectHoverIndex = writable({
	vertex: undefined,
	edge: undefined,
	face: undefined,
});

export const SelectionRect = writable(undefined);
