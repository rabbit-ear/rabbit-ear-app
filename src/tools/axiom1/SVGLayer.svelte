<script>
	import { VertexRadiusCP } from "../../stores/Style.js";
	import {
		MoveCoords,
		DragCoords,
		Coords0,
		Coords1,
		Segment0,
		Segment1,
	} from "./stores.js";

	$: points = [$Coords0, $Coords1, $Segment0, $Segment1, $MoveCoords, $DragCoords]
		.filter(a => a !== undefined);
</script>

{#each points as point}
	<circle
		r={$VertexRadiusCP * 1.5}
		cx={point[0]}
		cy={point[1]} />
{/each}

{#if $Segment0 !== undefined && $DragCoords !== undefined}
	<line
		x1={$Segment0[0]}
		y1={$Segment0[1]}
		x2={$DragCoords[0]}
		y2={$DragCoords[1]}
		stroke-width={$VertexRadiusCP * 1.5} />
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
