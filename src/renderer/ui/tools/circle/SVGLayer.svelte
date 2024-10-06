<script lang="ts">
	import type { SVGViewport } from "../../viewport/SVGViewport/SVGViewport.svelte.ts";

	type PropsType = {
		viewport: SVGViewport;
		circle: { cx: number; cy: number; r: number };
	};
	let { viewport, circle }: PropsType = $props();
</script>

{#if circle}
	<circle {...circle} />
{/if}

<style>
	circle {
		fill: none;
		stroke: #fb4;
	}
</style>
