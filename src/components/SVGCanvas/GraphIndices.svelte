<script>
	import { midpoint2 } from "rabbit-ear/math/vector.js";
	import { centroid } from "rabbit-ear/math/polygon.js";
	import { ViewportCP } from "../../stores/ViewBox.js";
	import { BoundaryColor } from "../../stores/Style.js";
	import GraphIndexItem from "./GraphIndexItem.svelte";

	let vmin = 1;
	$: vmin = Math.min($ViewportCP[2], $ViewportCP[3]);

	let fontSize = 0.02;
	$: fontSize = vmin * 0.0333;

	export let graph = {};
	export let invertVertical = false;

	let vertices = [];
	$: vertices = (!graph || !graph.vertices_coords ? [] : graph.vertices_coords)
		.map(coord => ({ x: coord[0], y: coord[1] }));

	let edges = [];
	$: edges = (!graph || !graph.edges_vertices || !graph.vertices_coords
		? []
		: graph.edges_vertices.map(ev => ev.map(v => graph.vertices_coords[v])))
		.map(segment => midpoint2(...segment))
		.map(coord => ({ x: coord[0], y: coord[1] }));

	let faces = [];
	$: faces = (!graph || !graph.faces_vertices || !graph.vertices_coords
		? []
		: graph.faces_vertices.map(fv => fv.map(v => graph.vertices_coords[v])))
		.map(points => centroid(points))
		.map(coord => ({ x: coord[0], y: coord[1] }));
</script>

<g class="graph-indices">
	{#each faces as face, index}
		<GraphIndexItem name="faces" {...face} {index} {fontSize} {invertVertical} />
	{/each}
	{#each edges as edge, index}
		<GraphIndexItem name="edges" {...edge} {index} {fontSize} {invertVertical} />
	{/each}
	{#each vertices as vertex, index}
		<GraphIndexItem name="vertices" {...vertex} {index} {fontSize} {invertVertical} />
	{/each}
</g>

<style>
	g { pointer-events: none; }
</style>
