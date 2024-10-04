<script lang="ts">
	import app from "../../app/App.svelte.ts";
	const viewports = $derived(app.ui?.viewports || []);
</script>

<div class="row">
	{#each viewports as viewport, i}
		<viewport.component {viewport} />
		{#if i < viewports.length - 1}
			<div class="gap"></div>
		{/if}
	{/each}
</div>

<style>
	.row {
		display: flex;
		flex-direction: row;
		height: 100%;
	}
	.gap {
		width: 3px;
		background-color: #999;
	}
</style>
