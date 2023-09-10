<script>
	import {
		File,
		FrameIndex,
		Frames,
	} from "../../stores/Model.js";
	import Panel from "./Panel.svelte";

	let frame;
	$: frame = $Frames[$FrameIndex] || {};

	// const FRAME_CLASSES = [
	// 	"creasePattern",
	// 	"foldedForm",
	// ];

	// let frame_class = "";
	// $: frame_class = (frame.frame_classes || [])
	// 	.filter(a => FRAME_CLASSES.includes(a))
	// 	.shift();
</script>

<Panel>
	<span slot="title">frames ({$FrameIndex + 1}/{$Frames.length})</span>
	<span slot="body">
		<p>current frame: {$FrameIndex + 1}</p>
		<input type="text" bind:value={frame.frame_classes} >
		<!-- <input
			type="radio"
			name="frame-class"
			id="creasePattern"
			bind:group={frame.frame_classes[0]}
			value="creasePattern" />
		<label for="creasePattern">cp</label>
		<input
			type="radio"
			name="frame-class"
			id="foldedForm"
			bind:group={frame.frame_classes[0]}
			value="foldedForm" />
		<label for="foldedForm">folded</label> -->
	</span>
</Panel>

<style>
	input[type=text] {
		width: 100%;
	}
</style>
