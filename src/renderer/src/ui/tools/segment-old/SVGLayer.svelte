<script>
	import state from "./state.svelte.ts";
</script>

{#if state.tool?.svgSegment}
	<line {...state.tool?.svgSegment} />
{/if}

<style>
	line {
		fill: none;
		stroke: #fb4;
	}
</style>
