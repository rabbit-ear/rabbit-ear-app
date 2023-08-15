<script>
	import { validateKawasaki } from "rabbit-ear/singleVertex/validate.js";
	import { VertexRadius } from "../../stores/App.js";

	export let graph = {};

	let invalid = [];
	$: invalid = graph.edges_vertices ? validateKawasaki(graph) : [];

	$: console.log("invalid", invalid);
</script>

{#each invalid as v}
	<circle
		r={$VertexRadius * 4}
		cx={graph.vertices_coords[v][0]}
		cy={graph.vertices_coords[v][1]}
		stroke="none"
		fill="#e53a" />
{/each}


<style>
	
</style>