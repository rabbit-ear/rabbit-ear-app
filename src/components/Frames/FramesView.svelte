<script>
	import {
		File,
		FramesRendered,
		FrameIndex,
	} from "../../stores/Model.js"
	import GLPreview from "./GLPreview.svelte";
</script>

<div class="container">
	{#each $FramesRendered as frame, i}
		<button
			on:click={() => FrameIndex.set(i)}
			highlight={i === $FrameIndex}>
			<GLPreview graph={frame} />
		</button>
	{/each}
</div>

<style>
	button {
		all: unset;
		border: 2px solid transparent;
	}
	button[highlight=true] {
		border-color: #fb4;
	}
	.container {
		width: 100%;
		height: 6rem;
	}
</style>
