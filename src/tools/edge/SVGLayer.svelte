<script>
	import { VertexRadius } from "../../stores/Style.js";
	import {
		MoveCoords,
		PressCoords,
		DragCoords,
	} from "./stores.js";

	let points = [];
	$: points = [$MoveCoords, $PressCoords, $DragCoords]
		.filter(a => a !== undefined);
</script>

{#each points as point}
	<circle
		r={$VertexRadius * 1.5}
		cx={point[0]}
		cy={point[1]} />
{/each}

{#if $DragCoords !== undefined && $PressCoords !== undefined}
	<line
		x1={$PressCoords[0]}
		y1={$PressCoords[1]}
		x2={$DragCoords[0]}
		y2={$DragCoords[1]} />
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
