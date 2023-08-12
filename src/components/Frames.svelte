<script>
	import {
		File,
		FramesRendered,
		FrameIndex,
	} from "../stores/Model.js"
	import { DialogNewFrame } from "../stores/App.js";
	import GLPreview from "./Frames/GLPreview.svelte";

	const newFrame = () => $DialogNewFrame.showModal();
</script>

<div class="frames horizontal">
	{#each $FramesRendered as frame, i}
		<button
			on:click={() => FrameIndex.set(i)}
			highlight={i === $FrameIndex}>
			<GLPreview graph={frame} />
		</button>
	{/each}
	<button on:click={newFrame} class="plus-button">
		<svg
			class="plus-sign"
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 80 80">
			<rect x="35" y="20" width="10" height="40"/>
			<rect x="20" y="35" width="40" height="10"/>
		</svg>
	</button>
</div>

<style>
	.horizontal {
		display: flex;
		flex-direction: row;
		gap: 4px;
	}
	.frames {
		width: 100%;
		height: 100%;
		padding: 0.5rem;
		overflow-x: auto;
	}
	button {
		all: unset;
		flex: 0 0 auto;
		width: 5rem;
		height: 5rem;
		border: 2px solid transparent;
		border-radius: 4px;
/*		margin: 4px;*/
/*		padding: 2px;*/
		background-color: #2f2f2f;
	}
	button.plus-button {
		background-color: transparent;
	}
	button[highlight=true] {
		border-color: #fb4;
	}
	svg.plus-sign {
		fill: #ccc;
	}
	svg.plus-sign:hover {
		fill: #fb4;
	}
</style>
