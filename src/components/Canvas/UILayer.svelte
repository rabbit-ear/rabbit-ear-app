<script>
	import {
		viewBox,
		selectionRect,
	} from "../../stores/app.js";

	let vmax;
	$: vmax = Math.max($viewBox[2], $viewBox[3]);

	let tick = 0
	setInterval(() => { tick += (vmax * 0.002); }, 30);
</script>

<g class="ui-layer">
	{#if $selectionRect !== undefined}
		<rect
			x={$selectionRect.origin[0]}
			y={$selectionRect.origin[1]}
			width={$selectionRect.span[0]}
			height={$selectionRect.span[1]}
			fill="none"
			stroke="#fff8"
			stroke-dasharray={[vmax * 0.01, vmax * 0.01].join(" ")}
			stroke-dashoffset={tick}
		/>
	{/if}
</g>
