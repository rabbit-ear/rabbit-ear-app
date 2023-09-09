<script>
	import { VertexRadius } from "../../stores/App.js";
	import {
		Coords0,
		Coords1,
		Coords2,
		Coords3,
	} from "./stores.js";

	let points = [];
	$: points = [$Coords0, $Coords1, $Coords2, $Coords3]
		.filter(a => a !== undefined);
</script>

{#each points as point}
	<circle
		r={$VertexRadius * 1.5}
		cx={point[0]}
		cy={point[1]} />
{/each}

{#if $Coords2 !== undefined && $Coords3 !== undefined}
	<line
		x1={$Coords2[0]}
		y1={$Coords2[1]}
		x2={$Coords3[0]}
		y2={$Coords3[1]} />
{/if}

<style>
	circle {
		stroke: none;
		fill: var(--highlight);
	}
	line {
		stroke: var(--highlight);
	}
</style>
