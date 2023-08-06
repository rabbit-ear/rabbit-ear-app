<script>
	import { VertexRadius } from "../../stores/App.js";

	export let graph = {};
	export let fills = [];
	export let scales = [];

	let coords;
	$: coords = !graph.vertices_coords ? [] : graph.vertices_coords;
</script>

{#each coords as vertex, i}
	<circle
		r={scales[i] ? $VertexRadius * scales[i] : $VertexRadius}
		cx={vertex[0]}
		cy={vertex[1]}
		stroke="none"
		fill={fills[i] || "#aaa" } />
{/each}
