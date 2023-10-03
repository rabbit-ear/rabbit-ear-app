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
	@keyframes animate-dash {
		from { stroke-dashoffset: 0; }
		to { stroke-dashoffset: calc(500pt * var(--stroke-dash-length)); }
	}
	.animated-dashed-line {
		stroke-dasharray: var(--stroke-dash-length);
		animation: 60s linear 0s infinite reverse both running animate-dash;
	}
</style>