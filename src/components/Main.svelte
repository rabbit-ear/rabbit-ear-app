<script>
	import Header from "./Header.svelte";
	import Footer from "./Footer.svelte";
	import Toolbar from "./Toolbar.svelte";
	import SVGCanvas from "./SVGCanvas/SVGCanvas.svelte";
	import Simulator from "./OrigamiSimulator/Simulator.svelte";
	import Panels from "./Panels.svelte";
	import Dialogs from "./Dialogs.svelte";
	import Kernel from "./Kernel.svelte";
	import FileManager from "./FileManager.svelte";
	import DragAndDrop from "./DragAndDrop.svelte";
	import {
		ShowTerminal,
		ShowSimulator,
	} from "../stores/App.js";

	// these events originate from the SVG canvas
	let press;
	let move;
	let release;
	let scroll;

	// these events originate from the window
	let keydown;
	let keyup;

	let pairClass;
	$: pairClass = $ShowSimulator
		? "pair with-simulator"
		: "pair without-simulator";

	let contentClass;
	$: contentClass = $ShowTerminal
		? "content with-terminal"
		: "content without-terminal";

</script>

<svelte:window
	on:keydown={keydown}
	on:keyup={keyup}
/>

<main>
	<Dialogs />
	<Header />
	<div class={contentClass}>
		<Toolbar />
		<div class={pairClass}>
			<div class="svg-container">
				<SVGCanvas
					on:press={press}
					on:move={move}
					on:release={release}
					on:scroll={scroll}
				/>
			</div>
			{#if $ShowSimulator}
			<div>
				<Simulator />
			</div>
			{/if}
		</div>
		<Panels />
	</div>
	{#if $ShowTerminal}
		<Footer />
	{/if}
	<Kernel
		bind:press={press}
		bind:move={move}
		bind:release={release}
		bind:scroll={scroll}
		bind:keydown={keydown}
		bind:keyup={keyup}
	/>
	<FileManager />
	<DragAndDrop />
</main>

<style>
	main {
		width: 100%;
		height: 100vh;
	}
	.svg-container {
		overflow: hidden;
	}
	:global(.content) {
		display: flex;
		flex-direction: row;
	}
	:global(.content.with-terminal) {
		height: calc(100vh - 8rem);
	}
	:global(.content.without-terminal) {
		height: calc(100vh - 2rem);
	}
	:global(.pair) {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 100%;
		flex: 1 0 calc(100vw - 8rem - 12rem);
	}
	:global(.pair) > * {
		height: 100%;
	}
	:global(.pair.with-simulator) > * {
		width: 50%;
	}
	:global(.pair.without-simulator) > * {
		width: 100%;
	}
</style>
