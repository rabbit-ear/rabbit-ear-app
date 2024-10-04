<script lang="ts">
	import type { SVGViewport } from "../../viewport/SVGViewport.svelte.ts";

	type PropsType = {
		viewport: SVGViewport,
	}
	let {
		viewport,
	}: PropsType = $props();
</script>

{#if state && state.tool && state.tool.rect}
	<rect {...state.tool.rect} />
{/if}

<style>
	rect {
		fill: none;
		stroke: #fb4;
	}
</style>
