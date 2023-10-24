<script>
	import FrameRender from "./FrameRender.svelte";
	import NewFrameButton from "./NewFrameButton.svelte";
	import { IsolatedFrames } from "../../stores/Model.js"
	import { executeCommand } from "../../kernel/execute.js";

	let pressIndex;
	let hoverIndex;

	const mousemove = (index) => { hoverIndex = index; };
	const mousedown = (index) => { pressIndex = index; };
	const mouseup = (index) => {
		hoverIndex = index;
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
	tabindex="-1"
	role="row">
	{#each $IsolatedFrames as graph, index}
		<FrameRender {graph} {index} {mousedown} {mousemove} {mouseup} />
	{/each}
	<NewFrameButton />
</div>

<style>
	.frames {
		width: 100%;
		height: 100%;
		overflow-y: hidden;
		overflow-x: auto;
		border-top: 2px solid var(--background-2);
		background-color: var(--background-1);
	}
	/* prevent the tab-selection outline on the frame container. */
	/* it doesn't make sense what it would be doing anyway. */
	.frames:focus-visible {
		outline: none;
	}
	.horizontal {
		display: flex;
		flex-direction: row;
		gap: 4px;
	}
</style>
