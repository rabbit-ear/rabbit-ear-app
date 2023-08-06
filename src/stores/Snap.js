import { derived } from "svelte/store";
import { Graph } from "./Model.js";
import { Snapping } from "./App.js";
import { ViewBox } from "./ViewBox.js";
import { RulerPoints } from "./Ruler.js";
/**
 * - intersections between ruler lines and graph edges
 * - intersections between ruler lines and ruler lines
 * - graph vertices
 */
export const SnapPoints = derived(
	[Snapping, Graph, RulerPoints],
	([$Snapping, $Graph, $RulerPoints]) => $Snapping
		? [...($Graph.vertices_coords || []), ...$RulerPoints]
		: [],
	[],
);

export const SnapRadius = derived(
	ViewBox,
	$ViewBox => Math.max($ViewBox[2], $ViewBox[3]) * 0.05,
	0.05,
);
