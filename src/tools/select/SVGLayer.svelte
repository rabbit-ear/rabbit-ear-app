<script>
	import { SelectionRect } from "./stores.js";
</script>

{#if $SelectionRect !== undefined}
	<rect
		x={$SelectionRect.min[0]}
		y={$SelectionRect.min[1]}
		width={$SelectionRect.span[0]}
		height={$SelectionRect.span[1]}
		class="animated-dashed-line"
	/>
{/if}

<style>
	rect {
		fill: none;
		stroke: var(--text);
	}
</style>