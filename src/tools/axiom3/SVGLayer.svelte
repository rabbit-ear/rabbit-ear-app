<script>
	import { VertexRadius } from "../../stores/App.js";
	import {
		Coords0,
		Coords1,
	} from "./stores.js";

	let points = [];
	$: points = [$Coords0, $Coords1]
		.filter(a => a !== undefined);
</script>

{#each points as point}
	<circle
		r={$VertexRadius * 1.5}
		cx={point[0]}
		cy={point[1]} />
{/each}

{#if $Coords0 !== undefined && $Coords1 !== undefined}
	<line
		x1={$Coords0[0]}
		y1={$Coords0[1]}
		x2={$Coords1[0]}
		y2={$Coords1[1]} />
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
