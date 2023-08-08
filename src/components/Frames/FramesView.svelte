<script>
	import {
		File,
		FramesRendered,
		FrameIndex,
	} from "../../stores/Model.js"
	import { DialogNewFrame } from "../../stores/App.js";
	import GLPreview from "./GLPreview.svelte";

	const newFrame = () => {
		$DialogNewFrame.showModal();
	};
</script>

<div class="container">
	{#each $FramesRendered as frame, i}
		<button
			on:click={() => FrameIndex.set(i)}
			highlight={i === $FrameIndex}>
			<GLPreview graph={frame} />
		</button>
	{/each}
	<button on:click={newFrame} class="text-button">new frame</button>
</div>

<style>
	button {
		width: 5rem;
		height: 5rem;
		all: unset;
		border: 2px solid transparent;
	}
	button[highlight=true] {
		border-color: #fb4;
	}
	button.text-button {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.container {
		width: 100%;
		height: 6rem;
		display: flex;
		flex-direction: row;
	}
</style>
