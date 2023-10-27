<script>
	import { VertexRadiusFolded } from "../../stores/Style.js";
	import {
		FoldedMoveCoords,
		FoldedDragCoords,
		FoldedPress0Coords,
		FoldedRelease0Coords,
		FoldedPress1Coords,
		FoldedRelease1Coords,
	} from "./stores.js";

	$: points = [
		$FoldedPress0Coords, 
		$FoldedRelease0Coords, 
		$FoldedPress1Coords, 
		$FoldedRelease1Coords, 
		$FoldedMoveCoords, 
		$FoldedDragCoords
	].filter(a => a !== undefined);
</script>

{#each points as point}
	<circle
		r={$VertexRadiusFolded * 1.5}
		cx={point[0]}
		cy={point[1]} />
{/each}

{#if $FoldedPress1Coords !== undefined && $FoldedDragCoords !== undefined}
	<line
		x1={$FoldedPress1Coords[0]}
		y1={$FoldedPress1Coords[1]}
		x2={$FoldedDragCoords[0]}
		y2={$FoldedDragCoords[1]}
		stroke-width={$VertexRadiusFolded * 1.5} />
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
