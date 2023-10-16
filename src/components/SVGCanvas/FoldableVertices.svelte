<script>
	import {
		InvalidKawasaki,
		InvalidMaekawa,
	} from "../../stores/Model.js";
	import {
		VertexRadius,
	} from "../../stores/Style.js";

	export let graph = {};

	$: rK = $VertexRadius * 2;
	$: rM = $VertexRadius * 3;

	// todo: show smallest-sector assignment violation
	let kawasaki = [];
	let maekawa = [];

	$: kawasaki = graph && graph.vertices_coords
		? $InvalidKawasaki
			.map(v => graph.vertices_coords[v])
			.filter(a => a !== undefined)
			.map(([cx, cy]) => ({ cx, cy, r: rK, class: "kawasaki" }))
		: [];
	$: maekawa = graph && graph.vertices_coords
		?	$InvalidMaekawa
			.map(v => graph.vertices_coords[v])
			.filter(a => a !== undefined)
			.map(([cx, cy]) => ({
				cx, cy, r: rM, class: "maekawa", "stroke-width": $VertexRadius,
			}))
		: [];
</script>

{#each kawasaki as attr}
	<circle {...attr} />
{/each}

{#each maekawa as attr}
	<circle {...attr} />
{/each}

<style>
	.kawasaki {
		stroke: none;
		fill: #e53;
	}
	.maekawa {
		stroke: #fb4a;
		fill: none;
	}
</style>
