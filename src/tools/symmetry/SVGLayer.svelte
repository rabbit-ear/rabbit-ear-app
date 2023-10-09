<script>
	import { VertexRadius } from "../../stores/Style.js";
	import { clipLineInLargerViewport } from "../../js/intersect.js";
	import { ReflectionLines } from "./stores.js";
	import { ViewportCP } from "../../stores/ViewBox.js";
	import {
		MoveCoords,
		PressCoords,
		DragCoords,
		PointerLine,
	} from "./stores.js";

	let points = [];
	$: points = [$MoveCoords, $PressCoords, $DragCoords]
		.filter(a => a !== undefined);

	let segments;
	$: segments = $ReflectionLines
		.map(line => clipLineInLargerViewport(line, $ViewportCP))
		.filter(res => res !== undefined)
		.filter(res => res.length > 1);

	let preview;
	$: preview = $PointerLine === undefined
		? undefined
		: clipLineInLargerViewport($PointerLine, $ViewportCP);
</script>

<g>
	{#each segments as s}
		<line
			x1={s[0][0]}
			y1={s[0][1]}
			x2={s[1][0]}
			y2={s[1][1]}
			class="animated-dashed-line"
		/>
	{/each}
</g>

{#if preview}
	<line
		x1={preview[0][0]}
		y1={preview[0][1]}
		x2={preview[1][0]}
		y2={preview[1][1]}
		class="animated-dashed-line"
	/>
{/if}

{#each points as point}
	<circle
		r={$VertexRadius * 1.5}
		cx={point[0]}
		cy={point[1]} />
{/each}

<!-- {#if $DragCoords !== undefined && $PressCoords !== undefined}
	<line
		x1={$PressCoords[0]}
		y1={$PressCoords[1]}
		x2={$DragCoords[0]}
		y2={$DragCoords[1]}
		/>
{/if} -->

<style>
	line {
		stroke: var(--highlight);
	}
	circle {
		stroke: none;
		fill: var(--highlight);
	}
</style>
