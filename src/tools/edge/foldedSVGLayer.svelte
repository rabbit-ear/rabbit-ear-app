<script>
	import { VertexRadiusFolded } from "../../stores/Style.js";
	import {
		FoldedMoveCoords,
		FoldedPressCoords,
		FoldedDragCoords,
	} from "./stores.js";

	let points = [];
	$: points = [$FoldedMoveCoords, $FoldedPressCoords, $FoldedDragCoords]
		.filter(a => a !== undefined);
</script>

{#each points as point}
	<circle
		r={$VertexRadiusFolded * 1.5}
		cx={point[0]}
		cy={point[1]} />
{/each}

{#if $FoldedDragCoords !== undefined && $FoldedPressCoords !== undefined}
	<line
		x1={$FoldedPressCoords[0]}
		y1={$FoldedPressCoords[1]}
		x2={$FoldedDragCoords[0]}
		y2={$FoldedDragCoords[1]} />
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
