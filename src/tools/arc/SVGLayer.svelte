<script>
	import { VertexRadiusCP } from "../../stores/Style.js";
	import { DrawRect } from "./stores.js";
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
		r={$VertexRadiusCP * 1.5}
		cx={point[0]}
		cy={point[1]} />
{/each}

{#if $DrawRect !== undefined}
	<rect
		x={$DrawRect.min[0]}
		y={$DrawRect.min[1]}
		width={$DrawRect.span[0]}
		height={$DrawRect.span[1]}
	/>
{/if}

<style>
	circle {
		stroke: none;
		fill: var(--highlight);
	}
	rect {
		fill: none;
		stroke: var(--highlight);
	}
</style>
