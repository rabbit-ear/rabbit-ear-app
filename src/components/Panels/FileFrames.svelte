<script>
	import {
		FrameIndex,
		Frames,
	} from "../../stores/Model.js";

	$: frame = $Frames[$FrameIndex] || {};

	// const FRAME_CLASSES = [
	// 	"creasePattern",
	// 	"foldedForm",
	// ];

	// $: frame_class = (frame.frame_classes || [])
	// 	.filter(a => FRAME_CLASSES.includes(a))
	// 	.shift();
</script>

<div class="flex-column gap">
	<p>Frame <span class="bold">{$FrameIndex + 1}/{$Frames.length}</span></p>
	<input
		type="range"
		min={0}
		max={$Frames.length - 1}
		bind:value={$FrameIndex}>
	<hr />
	{#if frame && frame.frame_classes}
		<p>{frame.frame_classes.join(", ")}</p>
	{/if}
</div>

<style>
	input[type=range] {
		width: 100%;
	}
	.bold {
		font-weight: bold;
	}
</style>
