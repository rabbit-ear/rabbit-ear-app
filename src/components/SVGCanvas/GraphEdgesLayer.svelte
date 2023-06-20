<script>
	export let graph = {};
	export let highlighted = [];

	let edges_segment;
	$: edges_segment = !graph.edges_vertices
		? []
		: graph.edges_vertices
		.map(ev => ev.map(v => graph.vertices_coords[v]));
</script>

{#each edges_segment as seg, i}
	<line
		x1={seg[0][0]}
		y1={seg[0][1]}
		x2={seg[1][0]}
		y2={seg[1][1]}
		stroke={highlighted[i] ? "#fb4" : "#777"} />
{/each}
