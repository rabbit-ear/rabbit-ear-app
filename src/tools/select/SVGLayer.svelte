<script>
	import { ViewBox } from "../../stores/ViewBox.js";
	import { SelectionRect } from "./stores.js";

	let vmax;
	$: vmax = Math.max($ViewBox[2], $ViewBox[3]);

	let tick = 0
	setInterval(() => { tick += (vmax * 0.002); }, 30);
</script>

<g>
	{#if $SelectionRect !== undefined}
		<rect
			x={$SelectionRect.min[0]}
			y={$SelectionRect.min[1]}
			width={$SelectionRect.span[0]}
			height={$SelectionRect.span[1]}
			stroke-dasharray={[vmax * 0.01, vmax * 0.01].join(" ")}
			stroke-dashoffset={tick}
		/>
	{/if}
</g>

<style>
	rect {
		fill: none;
		stroke: var(--text);
	}
</style>