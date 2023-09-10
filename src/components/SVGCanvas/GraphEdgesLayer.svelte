<script>
	import { edgeFoldAngleIsFlat } from "rabbit-ear/fold/spec.js";
	import { ViewBox } from "../../stores/ViewBox.js";
	import {
		StrokeWidth,
		// lineOpacity,
		BoundaryColor,
		MountainColor,
		ValleyColor,
		FlatColor,
		JoinColor,
		CutColor,
		UnassignedColor,
	} from "../../stores/Style.js";

	export let graph = {};
	export let strokes = [];
	export let strokeWidths = [];

	let vmax;
	$: vmax = Math.max($ViewBox[2], $ViewBox[3]);

	let edges_segment;
	$: edges_segment = !graph.edges_vertices
		? []
		: graph.edges_vertices
		.map(ev => ev.map(v => graph.vertices_coords[v]));

	let edges_flat;
	$: edges_flat = !graph.edges_foldAngle
		? []
		: graph.edges_foldAngle.map(edgeFoldAngleIsFlat);

	let colorMap = {};
	$: colorMap = {
		B: $BoundaryColor,
		b: $BoundaryColor,
		M: $MountainColor,
		m: $MountainColor,
		V: $ValleyColor,
		v: $ValleyColor,
		F: $FlatColor,
		f: $FlatColor,
		J: $JoinColor,
		j: $JoinColor,
		C: $CutColor,
		c: $CutColor,
		U: $UnassignedColor,
		u: $UnassignedColor,
	};

	let edgesColor = [];
	$: edgesColor = graph.edges_assignment
		?	(graph.edges_vertices || [])
			.map((_, i) => graph.edges_assignment[i])
			.map(a => colorMap[a] || "#777")
		: (graph.edges_vertices || []).map(() => "#777");
</script>

{#each edges_segment as seg, i}
	<line
		x1={seg[0][0]}
		y1={seg[0][1]}
		x2={seg[1][0]}
		y2={seg[1][1]}
		stroke-dasharray={edges_flat[i] ? "" : [vmax * 0.01, vmax * 0.01].join(" ")}
		stroke-width={strokeWidths[i] || $StrokeWidth}
		stroke={strokes[i] || edgesColor[i]} />
{/each}
