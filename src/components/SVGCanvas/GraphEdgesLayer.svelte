<script>
	import {
		// lineOpacity,
		boundaryColor,
		mountainColor,
		valleyColor,
		flatColor,
		joinColor,
		cutColor,
		unassignedColor,
	} from "../../stores/style.js";

	export let graph = {};
	export let strokes = [];

	let edges_segment;
	$: edges_segment = !graph.edges_vertices
		? []
		: graph.edges_vertices
		.map(ev => ev.map(v => graph.vertices_coords[v]));

	let colorMap = {};
	$: colorMap = {
		B: $boundaryColor,
		b: $boundaryColor,
		M: $mountainColor,
		m: $mountainColor,
		V: $valleyColor,
		v: $valleyColor,
		F: $flatColor,
		f: $flatColor,
		J: $joinColor,
		j: $joinColor,
		C: $cutColor,
		c: $cutColor,
		U: $unassignedColor,
		u: $unassignedColor,
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
		stroke={strokes[i] || edgesColor[i]} />
{/each}
