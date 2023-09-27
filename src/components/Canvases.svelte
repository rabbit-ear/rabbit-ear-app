<script>
	import { Graph } from "../stores/Model.js";
	import {
		ShowMenu,
		ShowFrames,
		ShowTerminal,
		ShowSimulator,
		ShowCodeEditor,
		ShowStaticOrSimulator,
	} from "../stores/App.js";
	import CreasePattern from "./SVGCanvas/CreasePattern.svelte";
	import FoldedForm from "./SVGCanvas/FoldedForm.svelte";
	import WebGLCanvas from "./WebGLCanvas/WebGLCanvas.svelte";
	import Simulator from "./OrigamiSimulator/Simulator.svelte";
	import CodeEditor from "./CodeEditor/CodeEditor.svelte";

	export let press;
	export let move;
	export let release;
	export let scroll;

	let isFoldedForm = false;
	$: isFoldedForm = $Graph.frame_classes
		&& $Graph.frame_classes.length
		&& $Graph.frame_classes.includes("foldedForm");

	let height = "100vh";
	$: height = [
		"100vh - 5px",
		ShowMenu ? "2rem" : "",
		$ShowFrames ? "6.5rem" : "",
		$ShowTerminal ? "6rem" : "2rem",
	].filter(a => a !== "").join(" - ");
</script>

<!--
	here, we can separate light and dark mode rendering styles.
	css rules are children of .svg-canvas so we can append a
	.light or .dark, even calculating in JS if we need, then
	it should render appropriately.
-->

<div class="canvases horizontal">
	{#if isFoldedForm}
		<div class="canvas">
			<WebGLCanvas graph={$Graph}/>
		</div>
	{:else}
		<div class="canvas svg-canvas" style={`max-height: calc(${height})`}>
			<CreasePattern
				on:press={press}
				on:move={move}
				on:release={release}
				on:scroll={scroll}
			/>
		</div>
	{/if}
	{#if $ShowStaticOrSimulator}
		<div class="canvas">
			<Simulator />
		</div>
	{:else}
		<div class="canvas" style={`max-height: calc(${height})`}>
			<FoldedForm />
		</div>
	{/if}
	{#if $ShowCodeEditor}
		<div class="canvas">
			<CodeEditor />
		</div>
	{/if}
</div>

<style>
	.horizontal {
		display: flex;
		flex-direction: row;
	}
	.canvases {
		width: 100%;
		height: 100%;
	}
	.canvas {
		width: 100%;
		height: 100%;
		flex: 1 1 auto;
	}
	/* .svg-canvas { */
		/* svgs are especially unrully */
		/* this part might need more attention */
		/* now it is calculated in the Javascript section */
		/* max-height: calc(100vh - 2rem - 6rem - 6rem); */
	/* } */
</style>
