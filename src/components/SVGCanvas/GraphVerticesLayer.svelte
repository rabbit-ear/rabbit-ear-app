<script>
	import { viewBox } from "../../stores/viewBox.js";

	export let graph = {};
	export let fills = [];

	let r;
	$: r = Math.max($viewBox[2], $viewBox[3]) * 0.01;

	let coords;
	$: coords = !graph.vertices_coords ? [] : graph.vertices_coords;
</script>

{#each coords as vertex, i}
	<circle
		r={r}
		cx={vertex[0]}
		cy={vertex[1]}
		stroke="none"
		fill={fills[i] || "#aaa" } />
{/each}


