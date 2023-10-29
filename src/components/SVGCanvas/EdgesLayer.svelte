<script>
	import {
		edgeFoldAngleIsFlat,
		edgesAssignmentNames,
	} from "rabbit-ear/fold/spec.js";
	import { joinSelectedHighlighted } from "./attributes.js";
	import { makeSVGEdgesCoords } from "../../js/graph.js";

	export let graph = {};
	export let strokeWidth = 0.01;
	export let strokeDasharray = 0.05;
	export let selected = [];
	export let highlighted = [];

	$: selectedHighlight = joinSelectedHighlighted(selected, highlighted);
	$: edgesCoords = makeSVGEdgesCoords(graph);
	$: edgesFoldAngleIsFlat = graph && graph.edges_foldAngle
		? graph.edges_foldAngle.map(edgeFoldAngleIsFlat)
		: [];
	$: edgesClass = edgesCoords.map((_, i) => [
		(graph && graph.edges_assignment
			? edgesAssignmentNames[graph.edges_assignment[i]]
			: undefined),
		(edgesFoldAngleIsFlat[i] === false ? "dashed-line" : undefined),
		...(selectedHighlight[i] || []),
	].filter(a => a !== undefined).join(" "));

	let lines = [];
	$: lines = edgesCoords
		.map((coords, i) => ({ ...coords, class: edgesClass[i] }));
</script>

<g class="edges"
	style={`--stroke-width: ${strokeWidth}; --stroke-dasharray: ${strokeDasharray}`}>
	{#each lines as line, i}
		<line {...line} />
	{/each}
</g>

<style>
	line {
		stroke-width: var(--stroke-width);
	}
	line.highlighted {
		stroke-width: calc(var(--stroke-width) * 3pt);
	}
	.dashed-line {
		stroke-dasharray: var(--stroke-dasharray);
	}
</style>
