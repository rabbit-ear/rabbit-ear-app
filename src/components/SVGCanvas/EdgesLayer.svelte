<script>
	import { edgeFoldAngleIsFlat } from "rabbit-ear/fold/spec.js";
	import {
		AssignmentColor,
		StrokeWidthCreasePattern,
		StrokeDashLengthCreasePattern,
	} from "../../stores/Style.js";

	export let graph = {};
	export let strokeWidth = 0.01;
	export let strokeDasharray = 0.05;
	export let attributes = [];

	// just learned this:
	// if edge endpoints are floating point values with 12-16 digits,
	// the rendering is MUCH slower than if the same edges' endpoints
	// are integers.
	let coords = [];
	$: coords = !graph.edges_vertices
		? []
		: graph.edges_vertices
			.map(ev => ev.map(v => graph.vertices_coords[v]))
			.map(s => ({ x1: s[0][0], y1: s[0][1], x2: s[1][0], y2: s[1][1] }));

	let strokes = [];
	$: strokes = coords.map((_, i) => ($AssignmentColor[graph.edges_assignment
		? graph.edges_assignment[i]
		: ""]) || "gray");

	let edgesFoldAngleIsFlat = []
	$: edgesFoldAngleIsFlat = (graph.edges_foldAngle || []).map(edgeFoldAngleIsFlat);

	let lines = [];
	$: lines = coords.map((coord, i) => ({
		...coord,
		...(attributes[i] || {}),
		stroke: strokes[i],
	})).map((attrs, i) => {
		if (!edgesFoldAngleIsFlat[i]) {
			attrs.class = attrs.class
				? attrs.class + " " + "dashed-line"
				: "dashed-line";
		}
		return attrs;
	});
</script>

<g
	class="edges"
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
