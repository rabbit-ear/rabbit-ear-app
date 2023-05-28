<script>
	import { graph } from "../../stores/graph.js";
</script>

<g>
	{#each $graph.vertices_coords as vertex}
		<circle r="0.1" cx={vertex[0]} cy={vertex[1]} />
	{/each}
</g>
