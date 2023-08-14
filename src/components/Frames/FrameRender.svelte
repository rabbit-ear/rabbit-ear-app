<script>
	import FrameItem from "./FrameItem.svelte";
	import WebGLCanvas from "../WebGLCanvas/WebGLCanvas.svelte";
	import { FrameIndex } from "../../stores/Model.js"

	export let graph;
	export let index;
</script>

	<FrameItem
		on:click={() => FrameIndex.set(index)}
		highlight={index === $FrameIndex}
	>
		<WebGLCanvas {graph} />
	</FrameItem>

<style>
	
</style>