<script>
	import FrameRender from "./FrameRender.svelte";
	import NewFrameButton from "./NewFrameButton.svelte";
	import { FramesRendered } from "../../stores/Model.js"
	import { executeCommand } from "../../kernel/execute.js";

	let pressIndex;
	let hoverIndex;
	const mousemove = (e) => {
		if (e.buttons && pressIndex !== undefined) {
			const hoverElement = document
				.querySelectorAll("button[class^='button-frame-item']:hover")[0];
			if (!hoverElement) {
				hoverIndex = undefined;
				return;
			}
			hoverIndex = parseInt(hoverElement.dataset.frameIndex, 10);
		}
	}
	const mousedown = (index) => {
		pressIndex = index;
	}
	const mouseup = (e) => {
		if (pressIndex !== undefined
			&& hoverIndex !== undefined
			&& pressIndex >= 0
			&& hoverIndex >= 0
			&& !isNaN(hoverIndex)
			&& pressIndex !== hoverIndex) {
			executeCommand("moveFrameIndex", pressIndex, hoverIndex);
		}
		pressIndex = undefined;
		hoverIndex = undefined;
	};
</script>

<div
	class="frames horizontal"
	role="row"
	tabindex="-1"
	on:mousemove={mousemove}
	on:mouseup={mouseup}>
	{#each $FramesRendered as graph, index}
		<FrameRender {graph} {index} {mousedown} />
	{/each}
	<NewFrameButton />
</div>

<style>
	.frames {
		width: 100%;
		height: 100%;
		overflow-x: auto;
		border-top: 2px solid var(--background-2);
/*		padding: 0.5rem;*/
	}
	.horizontal {
		display: flex;
		flex-direction: row;
		gap: 4px;
	}
</style>
