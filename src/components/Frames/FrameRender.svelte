<script>
	import FrameItem from "./FrameItem.svelte";
	import WebGLCanvas from "../WebGLCanvas/WebGLCanvas.svelte";
	import { FrameIndex } from "../../stores/Model.js"

	export let graph;
	export let index;
	export let mousedown = () => {};
</script>

	<FrameItem
		on:click={() => FrameIndex.set(index)}
		on:mousedown={() => mousedown(index)}
		highlight={index === $FrameIndex}
		{index}
	>
		<WebGLCanvas {graph} />
	</FrameItem>
