<script>
	import { Graph } from "../stores/Model.js";
	import { ShowSimulator } from "../stores/App.js";
	import SVGCanvas from "./SVGCanvas/SVGCanvas.svelte";
	import WebGLCanvas from "./WebGLCanvas/WebGLCanvas.svelte";
	import Simulator from "./OrigamiSimulator/Simulator.svelte";

	export let press;
	export let move;
	export let release;
	export let scroll;

	let isFoldedForm = false;
	$: isFoldedForm = $Graph.frame_classes
		&& $Graph.frame_classes.length
		&& $Graph.frame_classes.includes("foldedForm");
</script>

<div class="canvases horizontal">
	{#if isFoldedForm}
		<div class="webgl-canvas">
			<WebGLCanvas />
		</div>
	{:else}
		<div class="svg-canvas">
			<SVGCanvas
				on:press={press}
				on:move={move}
				on:release={release}
				on:scroll={scroll}
			/>
		</div>
	{/if}
	{#if $ShowSimulator}
		<div class="simulator-canvas">
			<Simulator />
		</div>
	{/if}
</div>

<style>
	.canvases {
		width: 100%;
		height: 100%;
	}
	.horizontal {
		display: flex;
		flex-direction: row;
	}
	.webgl-canvas {
		width: 100%;
		height: 100%;
		flex: 1 1 auto;
	}
	.svg-canvas {
		width: 100%;
		height: 100%;
		/* svgs are especially unrully */
		/* this part might need more attention */
		max-height: calc(100vh - 2rem - 6rem - 6rem);
		flex: 1 1 auto;
	}
	.simulator-canvas {
		width: 100%;
		height: 100%;
		flex: 1 1 auto;
	}
</style>
