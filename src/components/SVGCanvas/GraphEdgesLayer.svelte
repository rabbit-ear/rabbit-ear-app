<script>
	import { edgeFoldAngleIsFlat } from "rabbit-ear/fold/spec.js";
	import {
		AssignmentColor,
		// todo: these are causing the renderer to re-draw edges
		// anytime the viewbox is zoomed or panned.
		StrokeWidth,
		StrokeDashArray,
	} from "../../stores/Style.js";

	// todo, make this an app wide variable
	const HighlightWidthFactor = 3;

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

	let strokeWidths = []
	$: strokeWidths = coords.map((_, i) => (highlightedHash[i]
		? $StrokeWidth * HighlightWidthFactor
		: $StrokeWidth));

	let classes = [];
	$: classes = coords.map((_, i) => [
		selectedHash[i] ? "selected" : undefined,
		highlightedHash[i] ? "highlighted" : undefined,
	].filter(a => a !== undefined).join(" "));

	let lines = [];
	$: lines = coords.map((coord, i) => ({
		...coord,
		...(classes[i] === "" ? {} : { class: classes[i] }),
		stroke: strokes[i],
		"stroke-width": strokeWidths[i],
		...(edgesFoldAngleIsFlat[i] ? {} : { "stroke-dasharray": $StrokeDashArray }),
	}));
</script>

{#each lines as line, i}
	<line {...line} />
{/each}
