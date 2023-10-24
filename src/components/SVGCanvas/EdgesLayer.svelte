<script>
	import {
		edgeFoldAngleIsFlat,
		edgesAssignmentNames,
	} from "rabbit-ear/fold/spec.js";
	import { joinSelectedHighlighted } from "./attributes.js";

	export let graph = {};
	export let strokeWidth = 0.01;
	export let strokeDasharray = 0.05;
	export let selected = [];
	export let highlighted = [];

	$: selectedHighlight = joinSelectedHighlighted(selected, highlighted);

	let edgesFoldAngleIsFlat = []
	$: edgesFoldAngleIsFlat = graph && graph.edges_foldAngle
		? graph.edges_foldAngle.map(edgeFoldAngleIsFlat)
		: [];

	// just learned this:
	// if edge endpoints are floating point values with 12-16 digits,
	// the rendering is MUCH slower than if the same edges' endpoints
	// are integers.
	let edgesCoords = [];
	$: edgesCoords = (graph && graph.edges_vertices && graph.vertices_coords
		? graph.edges_vertices
		: [])
		.map(ev => ev.map(v => graph.vertices_coords[v]))
		// todo: cut double precision to float precision for rendering speed
		.map(s => ({ x1: s[0][0], y1: s[0][1], x2: s[1][0], y2: s[1][1] }));

	let edgesClass = [];
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
