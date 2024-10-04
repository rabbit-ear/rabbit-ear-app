<script>
	import state from "./state.svelte.ts";
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
