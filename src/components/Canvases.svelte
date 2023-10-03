<script>
	import {
		FoldedForm,
		FrameEdgesAreFlat,
	} from "../stores/Model.js";
	import {
		ShowMenu,
		ShowFrames,
		ShowCodeEditor,
		ShowStaticOrSimulator,
	} from "../stores/App.js";
	import CreasePatternCanvas from "./SVGCanvas/CreasePattern.svelte";
	import FoldedFormCanvas from "./SVGCanvas/FoldedForm.svelte";
	import WebGLCanvas from "./WebGLCanvas/WebGLCanvas.svelte";
	import Simulator from "./OrigamiSimulator/Simulator.svelte";
	import CodeEditor from "./CodeEditor/CodeEditor.svelte";

	export let pressCP;
	export let moveCP;
	export let releaseCP;
	export let scrollCP;

	export let pressFolded;
	export let moveFolded;
	export let releaseFolded;
	export let scrollFolded;

	let height = "100vh";
	$: height = [
		"100vh",
		ShowMenu ? "2rem" : "",
		$ShowFrames ? "5rem - 4px - 2px" : "", // button height, button border, container border
		"6rem", // terminal
	].filter(a => a !== "").join(" - ");
</script>

<!--
	here, we can separate light and dark mode rendering styles.
	css rules are children of .crease-pattern so we can append a
	.light or .dark, even calculating in JS if we need, then
	it should render appropriately.
-->

<div class="canvases horizontal">
	<div class="canvas crease-pattern" style={`max-height: calc(${height})`}>
		<CreasePatternCanvas
			on:press={pressCP}
			on:move={moveCP}
			on:release={releaseCP}
			on:scroll={scrollCP}
		/>
	</div>
	{#if $ShowStaticOrSimulator}
		<div class="canvas">
			<Simulator />
		</div>
	{:else}
		{#if $FrameEdgesAreFlat}
			<div class="canvas folded-form" style={`max-height: calc(${height})`}>
				<FoldedFormCanvas
					on:press={pressFolded}
					on:move={moveFolded}
					on:release={releaseFolded}
					on:scroll={scrollFolded}
				/>
			</div>
		{:else}
			<div class="canvas folded-form" style={`max-height: calc(${height})`}>
				<WebGLCanvas graph={$FoldedForm}/>
			</div>
		{/if}
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
		gap: 2px;
	}
	.canvases {
		width: 100%;
		height: 100%;
		background-color: var(--background-2);
	}
	.canvas {
		width: 100%;
		height: 100%;
		flex: 1 1 auto;
		background-color: var(--background-0);
	}
	/* .crease-pattern { */
		/* svgs are especially unrully */
		/* this part might need more attention */
		/* now it is calculated in the Javascript section */
		/* max-height: calc(100vh - 2rem - 6rem - 6rem); */
	/* } */
</style>
