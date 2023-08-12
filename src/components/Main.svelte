<script>
	import Header from "./Header.svelte";
	import Terminal from "./Terminal.svelte";
	import Toolbar from "./Toolbar.svelte";
	import Canvases from "./Canvases.svelte";
	import Panels from "./Panels.svelte";
	import Frames from "./Frames.svelte";
	import Dialogs from "./Dialogs.svelte";
	import Kernel from "./Kernel.svelte";
	import FileManager from "./FileManager.svelte";
	import DragAndDrop from "./DragAndDrop.svelte";
	import {
		ShowHeader,
		ShowTerminal,
	} from "../stores/App.js";

	// these events originate from the SVG canvas
	let press;
	let move;
	let release;
	let scroll;

	// these events originate from the window
	let keydown;
	let keyup;
</script>

<svelte:window
	on:keydown={keydown}
	on:keyup={keyup}
/>

<Dialogs />
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

<main class="vertical">
	{#if ShowHeader}
		<div class="header">
			<Header />
		</div>
	{/if}
	<div class="gui horizontal">
		<div class="toolbar">
			<Toolbar />
		</div>
		<div class="renderings vertical">
			<div class="canvases">
				<Canvases {press} {move} {release} {scroll} />
			</div>
			<div class="frames">
				<Frames />
			</div>
		</div>
		<div class="panels">
			<Panels />
		</div>
	</div>
	{#if $ShowTerminal}
		<div class="terminal">
			<Terminal />
		</div>
	{/if}
</main>

<style>
	main {
		width: 100vw;
		height: 100vh;
		max-width: 100vw;
		max-height: 100vh;
	}
	.vertical {
		display: flex;
		flex-direction: column;
	}
	.horizontal {
		display: flex;
		flex-direction: row;
	}

	/* main children: the top-most level */
	.header {
		width: 100%;
		height: 2rem;
		flex: 0 0 auto;
	}
	.gui {
		width: 100%;
		flex: 1 1 auto;
		min-height: 0;
	}
	.terminal {
		width: 100%;
		height: 6rem;
		flex: 0 1 auto;
	}

	/* .gui children */
	.toolbar {
		width: 8rem;
		height: 100%;
		flex: 0 0 auto;  /* shrink to 1 */
		overflow-y: auto;
		padding-top: 0.5rem;
	}
	.renderings {
		width: 100%;
		height: 100%;
		min-width: 0;
		flex: 1 1 auto;
	}
	.panels {
		width: 12rem;
		height: 100%;
		flex: 0 0 auto;  /* shrink to 1 */
		overflow-y: auto;
	}

	/* .renderings children */
	.canvases {
		flex: 1 1 auto;
	}
	.frames {
		flex: 0 1 auto;
		min-width: 0;
	}

	/* colors */
	.toolbar {
		background-color: #333;
	}
	.panels {
		background-color: #333;
	}
	.terminal {
		background-color: #333;
	}
</style>
