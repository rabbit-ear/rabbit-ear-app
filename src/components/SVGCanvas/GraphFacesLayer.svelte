<script>
	import { graph } from "../../stores/graph.js";
	import { selected } from "../../stores/select.js";

	let faces_polygon;
	$: faces_polygon = $graph.faces_vertices
		.map(fv => fv.map(v => $graph.vertices_coords[v]));
</script>

	{#each faces_polygon as poly, f}
		{#if $selected.faces[f]}
			<polygon points={poly.map(point => point.join(",")).join(" ")} fill="#fb44" />
		{:else}
			<polygon points={poly.map(point => point.join(",")).join(" ")} fill="#333" />
		{/if}
	{/each}
