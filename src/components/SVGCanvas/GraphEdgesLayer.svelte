<script>
	import { graph } from "../../stores/graph.js";
	import { selected } from "../../stores/select.js";

	let edges_segment;
	$: edges_segment = $graph.edges_vertices
		.map(ev => ev.map(v => $graph.vertices_coords[v]));
</script>

	{#each edges_segment as seg, e}
		{#if $selected.edges[e]}
			<line x1={seg[0][0]} y1={seg[0][1]} x2={seg[1][0]} y2={seg[1][1]} stroke="#fb4" />
		{:else}
			<line x1={seg[0][0]} y1={seg[0][1]} x2={seg[1][0]} y2={seg[1][1]} stroke="#777" />
		{/if}
	{/each}
