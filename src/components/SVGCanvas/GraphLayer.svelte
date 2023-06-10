<script>
	import { graph } from "../../stores/graph.js";
	import { viewBox } from "../../stores/app.js";
	import { selected } from "../../stores/select.js";

	let vmax;
	$: vmax = Math.max($viewBox[2], $viewBox[3]);

	let edges_segment;
	$: edges_segment = $graph.edges_vertices
		.map(ev => ev.map(v => $graph.vertices_coords[v]));

	let faces_polygon;
	$: faces_polygon = $graph.faces_vertices
		.map(fv => fv.map(v => $graph.vertices_coords[v]));
</script>

<g>
	{#each faces_polygon as poly, f}
		{#if $selected.faces[f]}
			<polygon points={poly.map(point => point.join(",")).join(" ")} fill="#fb44" />
		{:else}
			<polygon points={poly.map(point => point.join(",")).join(" ")} fill="#333" />
		{/if}
	{/each}

	{#each edges_segment as seg, e}
		{#if $selected.edges[e]}
			<line x1={seg[0][0]} y1={seg[0][1]} x2={seg[1][0]} y2={seg[1][1]} stroke="#fb4" />
		{:else}
			<line x1={seg[0][0]} y1={seg[0][1]} x2={seg[1][0]} y2={seg[1][1]} stroke="#777" />
		{/if}
	{/each}

	{#each $graph.vertices_coords as vertex, v}
		{#if $selected.vertices[v]}
			<circle r={vmax * 0.01} cx={vertex[0]} cy={vertex[1]} stroke="none" fill="#fb4" />
		{:else}
			<circle r={vmax * 0.01} cx={vertex[0]} cy={vertex[1]} stroke="none" fill="#aaa" />
		{/if}
	{/each}
</g>
