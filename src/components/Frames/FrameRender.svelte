<script>
	import FrameItem from "./FrameItem.svelte";
	import WebGLRender from "../WebGLCanvas/WebGLRender.svelte";
	import { FrameIndex } from "../../stores/Model.js"

	export let graph;
	export let index;
	export let mousedown = () => {};
	export let mouseup = () => {};
	export let mousemove = () => {};
</script>

	<FrameItem
		on:click={() => FrameIndex.set(index)}
		on:mousedown={() => mousedown(index)}
		on:mousemove={() => mousemove(index)}
		on:mouseup={() => mouseup(index)}
		highlight={index === $FrameIndex}
		{index} >
		<WebGLRender {graph} />
	</FrameItem>
