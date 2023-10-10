<script>
	import FrameItem from "./FrameItem.svelte";
	import WebGLRender from "../WebGLCanvas/WebGLRender.svelte";
	import { FrameIndex } from "../../stores/Model.js"
	import { VerticalUp } from "../../stores/App.js";

	export let graph;
	export let index;
	export let mousedown = () => {};
	export let mouseup = () => {};
	export let mousemove = () => {};

	$: viewMatrix = [1, 0, 0, 0, 0, $VerticalUp ? 1 : -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
</script>

	<FrameItem
		on:click={() => FrameIndex.set(index)}
		on:mousedown={() => mousedown(index)}
		on:mousemove={() => mousemove(index)}
		on:mouseup={() => mouseup(index)}
		highlight={index === $FrameIndex}
		{index} >
		<WebGLRender {graph} {viewMatrix} />
	</FrameItem>
