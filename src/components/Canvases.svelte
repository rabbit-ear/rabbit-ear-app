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
		Prefer3D,
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

	let fullHeight = "100vh";
	$: fullHeight = [
		"100vh",
		ShowMenu ? "2rem" : "",
		$ShowFrames ? "5rem - 4px - 2px" : "", // button height, button border, container border
		"6rem", // terminal
	].filter(a => a !== "").join(" - ");

	// I think we may need to add -2px for the flex gap. idk, appears not.
	$: halfHeight = `(${fullHeight}) / 2`;
	$: height = $ShowCodeEditor ? halfHeight : fullHeight;
</script>

<!--
	here, we can separate light and dark mode rendering styles.
	css rules are children of .crease-pattern so we can append a
	.light or .dark, even calculating in JS if we need, then
	it should render appropriately.
-->

<div class="canvases horizontal">

	{#if $ShowCodeEditor}
		<div class="vertical">
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
				<div class="canvas folded-form" style={`max-height: calc(${height})`}>
					{#if $FrameEdgesAreFlat && !$Prefer3D}
						<FoldedFormCanvas
							on:press={pressFolded}
							on:move={moveFolded}
							on:release={releaseFolded}
							on:scroll={scrollFolded} />
					{:else}
						<WebGLCanvas graph={$FoldedForm} />
					{/if}
				</div>
			{/if}
		</div>
		<div class="canvas code-canvas">
			<CodeEditor />
		</div>

	{:else}

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
			<div class="canvas folded-form" style={`max-height: calc(${height})`}>
				{#if $FrameEdgesAreFlat && !$Prefer3D}
					<FoldedFormCanvas
						on:press={pressFolded}
						on:move={moveFolded}
						on:release={releaseFolded}
						on:scroll={scrollFolded} />
				{:else}
					<WebGLCanvas graph={$FoldedForm} />
				{/if}
			</div>
		{/if}
	{/if}

</div>

<style>
	.horizontal {
		display: flex;
		flex-direction: row;
		gap: 2px;
	}
	.vertical {
		display: flex;
		flex-direction: column;
		gap: 2px;
		flex: 1 1 auto;
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
	.code-canvas {
		flex: 1 1 auto;
	}
	/* .crease-pattern { */
		/* svgs are especially unrully */
		/* this part might need more attention */
		/* now it is calculated in the Javascript section */
		/* max-height: calc(100vh - 2rem - 6rem - 6rem); */
	/* } */
</style>
