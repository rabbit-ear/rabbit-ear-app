<script>
	import {
		validateKawasaki,
		validateMaekawa,
	} from "rabbit-ear/singleVertex/validate.js";
	import { VertexRadius } from "../../stores/App.js";

	export let graph = {};

	// todo get rid of the graph.edges_vertices check

	let invalidKawasaki = [];
	$: invalidKawasaki = graph.edges_vertices ? validateKawasaki(graph, 1e-3) : [];

	let invalidMaekawa = [];
	$: invalidMaekawa = graph.edges_vertices ? validateMaekawa(graph) : [];

	// todo: show smallest-sector assignment violation

	// $: console.log("invalid (k, m)", invalidKawasaki, invalidMaekawa);
</script>

{#each invalidMaekawa as v}
	<circle
		r={$VertexRadius * 3}
		cx={graph.vertices_coords[v][0]}
		cy={graph.vertices_coords[v][1]}
		stroke="#fb4a"
		stroke-width={$VertexRadius * 1}
		fill="none" />
{/each}

{#each invalidKawasaki as v}
	<circle
		r={$VertexRadius * 2}
		cx={graph.vertices_coords[v][0]}
		cy={graph.vertices_coords[v][1]}
		stroke="none"
		fill="#e53" />
{/each}
