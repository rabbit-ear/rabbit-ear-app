<script>
	import { edgeFoldAngleIsFlat } from "rabbit-ear/fold/spec.js";
	import {
		AssignmentColor,
		StrokeWidthCreasePattern,
		StrokeDashLengthCreasePattern,
	} from "../../stores/Style.js";

	export let graph = {};
	export let selected = [];
	export let highlighted = [];

	let selectedHash = {};
	$: {
		selectedHash = {};
		selected.forEach(e => { selectedHash[e] = true; });
	};

	let highlightedHash = [];
	$: {
		highlightedHash = [];
		highlighted.forEach(i => { highlightedHash[i] = true; });
	};

	let coords = [];
	$: coords = !graph.edges_vertices
		? []
		: graph.edges_vertices
			.map(ev => ev.map(v => graph.vertices_coords[v]))
			.map(s => ({ x1: s[0][0], y1: s[0][1], x2: s[1][0], y2: s[1][1] }));

	let edgesFoldAngleIsFlat = [];
	$: edgesFoldAngleIsFlat = !graph.edges_foldAngle
		? []
		: graph.edges_foldAngle.map(edgeFoldAngleIsFlat);

	let strokes = [];
	$: strokes = coords.map((_, i) => ($AssignmentColor[graph.edges_assignment
		? graph.edges_assignment[i]
		: ""]) || "gray");

	let classes = [];
	$: classes = coords.map((_, i) => [
		selectedHash[i] ? "selected" : undefined,
		highlightedHash[i] ? "highlighted" : undefined,
		!edgesFoldAngleIsFlat[i] ? "dashed-line" : undefined,
	].filter(a => a !== undefined).join(" "));

	let lines = [];
	$: lines = coords.map((coord, i) => ({
		...coord,
		...(classes[i] === "" ? {} : { class: classes[i] }),
		stroke: strokes[i],
	}));

	// $: console.log("drawing svg edges", lines.length);

</script>

<g class="edges" style={`--stroke-width: ${$StrokeWidthCreasePattern}; --stroke-dash-length: ${$StrokeDashLengthCreasePattern}`}>
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
		stroke-dasharray: var(--stroke-dash-length);
	}
</style>
