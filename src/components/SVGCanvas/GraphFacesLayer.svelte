<script>
	export let graph = {};
	export let fills = [];

	let faces_polygon;
	$: faces_polygon = !graph.faces_vertices
		? []
		: graph.faces_vertices
		.map(fv => fv.map(v => graph.vertices_coords[v]));
</script>

{#each faces_polygon as poly, i}
	{#if fills[i]}
		<polygon
			points={poly.map(point => point.join(",")).join(" ")}
			fill={fills[i]} />
	{:else}
		<polygon points={poly.map(point => point.join(",")).join(" ")} />
	{/if}
{/each}
