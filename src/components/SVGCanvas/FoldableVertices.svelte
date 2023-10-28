<script>
	import {
		FoldAnglesAreFlat,
		InvalidKawasaki,
		InvalidMaekawa,
		InvalidVertices,
	} from "../../stores/ModelCP.js";
	import {
		VertexRadiusCP,
	} from "../../stores/Style.js";

	export let graph = {};

	$: rK = $VertexRadiusCP * 2;
	$: rM = $VertexRadiusCP * 3;

	// todo: show smallest-sector assignment violation
	let kawasaki = [];
	let maekawa = [];
	let invalid3D = [];

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
				cx, cy, r: rM, class: "maekawa", "stroke-width": $VertexRadiusCP,
			}))
		: [];
	$: invalid3D = graph && graph.vertices_coords
		?	$InvalidVertices
			.map(v => graph.vertices_coords[v])
			.filter(a => a !== undefined)
			.map(([cx, cy]) => ({
				cx, cy, r: rM, class: "kawasaki", "stroke-width": $VertexRadiusCP,
			}))
		: [];
</script>

{#if $FoldAnglesAreFlat}
	{#each kawasaki as attr}
		<circle {...attr} />
	{/each}

	{#each maekawa as attr}
		<circle {...attr} />
	{/each}
{:else}
	{#each invalid3D as attr}
		<circle {...attr} />
	{/each}
{/if}

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
