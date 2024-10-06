<script lang="ts">
	import type { SVGViewport } from "../../viewport/SVGViewport/SVGViewport.svelte.ts";

	type PropsType = {
		line: { x1: number; y1: number; x2: number; y2: number };
		viewport: SVGViewport;
	};
	let { line, viewport }: PropsType = $props();
</script>

{#if line}
	<line {...line} />
{/if}

<style>
</style>
