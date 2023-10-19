<script>
	import { VertexRadiusCP } from "../../stores/Style.js";
	import {
		MoveCoords,
		PressCoords,
	} from "./stores.js";

	let points = [];
	$: points = [$MoveCoords, $PressCoords].filter(a => a !== undefined);
</script>

{#each points as point}
	<circle
		r={$VertexRadiusCP * 1.5}
		cx={point[0]}
		cy={point[1]} />
{/each}

<style>
	circle {
		stroke: none;
		fill: var(--highlight);
	}
</style>
