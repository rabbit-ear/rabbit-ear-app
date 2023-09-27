<script>
	import { afterUpdate } from "svelte";
	// import ExpandButton from "./Frames/ExpandButton.svelte";
	import Frames from "./Frames/Frames.svelte";
	import { ShowFrames } from "../stores/App.js";

	// show/hide this component needs to tell origami simulator to
	// resize its canvas. this behavior is already hooked up through the
	// "resize" event, so we can simply trigger a new event to be called.
	afterUpdate(() => window.dispatchEvent(new Event("resize")));
</script>

<div class="container">
	<!-- <ExpandButton /> -->
	{#if $ShowFrames}
		<Frames />
	{/if}
</div>

<style>
	.container {
		width: 100%;
		height: 100%;
		min-width: 0;
		overflow: visible;
		position: relative;
	}
</style>
