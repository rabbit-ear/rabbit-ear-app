<script>
	import { VertexRadiusFolded } from "../../stores/Style.js";
	import {
		FoldedMoveCoords,
		FoldedDragCoords,
		FoldedCoords0,
		FoldedCoords1,
		FoldedSegment0,
		FoldedSegment1,
	} from "./stores.js";

	$: points = [
		$FoldedCoords0, 
		$FoldedCoords1, 
		$FoldedSegment0, 
		$FoldedSegment1, 
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

{#if $FoldedSegment0 !== undefined && $FoldedDragCoords !== undefined}
	<line
		x1={$FoldedSegment0[0]}
		y1={$FoldedSegment0[1]}
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
