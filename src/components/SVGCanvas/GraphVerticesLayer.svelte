<script>
	import { ViewBox } from "../../stores/ViewBox.js";

	export let graph = {};
	export let fills = [];
	export let radiuses = [];

	let r;
	$: r = Math.max($ViewBox[2], $ViewBox[3]) * 0.00666;

	let coords;
	$: coords = !graph.vertices_coords ? [] : graph.vertices_coords;
</script>

{#each coords as vertex, i}
	<circle
		r={radiuses[i] || r}
		cx={vertex[0]}
		cy={vertex[1]}
		stroke="none"
		fill={fills[i] || "#aaa" } />
{/each}


