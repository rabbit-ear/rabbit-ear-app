<script>
	import FrameRender from "./Frames/FrameRender.svelte";
	import NewFrameButton from "./Frames/NewFrameButton.svelte";
	import ExpandButton from "./Frames/ExpandButton.svelte";
	import { FramesRendered } from "../stores/Model.js"
	import { ShowFrames } from "../stores/App.js";
</script>

<div class="container">
	<ExpandButton />
	{#if $ShowFrames}
		<div class="frames horizontal">
			{#each $FramesRendered as graph, index}
				<FrameRender {graph} {index} />
			{/each}
			<NewFrameButton />
		</div>
	{/if}
</div>

<style>
	.container {
		width: 100%;
		height: 100%;
		min-width: 0;
		overflow: visible;
		position: relative;
	}
	.frames {
		width: 100%;
		height: 100%;
		overflow-x: auto;
		border-top: 2px solid var(--background-1);
		padding: 0.5rem;
	}
	.horizontal {
		display: flex;
		flex-direction: row;
		gap: 4px;
	}
</style>
