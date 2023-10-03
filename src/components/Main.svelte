<script>
	// import Stores from "./Stores.svelte";
	import Menu from "./Menu/Menu.svelte";
	import Terminal from "./Terminal.svelte";
	import Toolbar from "./Toolbar.svelte";
	import Canvases from "./Canvases.svelte";
	import Panels from "./Panels.svelte";
	import Frames from "./Frames.svelte";
	import Dialogs from "./Dialogs.svelte";
	import FileManager from "./FileManager.svelte";
	import DragAndDrop from "./DragAndDrop.svelte";
	import { ShowMenu } from "../stores/App.js";
	import { KeyboardEvent } from "../stores/KeyboardEvents.js";
	import {
		PointerEventCP,
		PointerEventFolded,
		ScrollEventCP,
		ScrollEventFolded,
	} from "../stores/TouchEvents.js";

	const pressCP = (e) => $PointerEventCP("press", e.detail);
	const moveCP = (e) => $PointerEventCP("move", e.detail);
	const releaseCP = (e) => $PointerEventCP("release", e.detail);
	const scrollCP = (e) => $ScrollEventCP(e.detail);

	const pressFolded = (e) => $PointerEventFolded("press", e.detail);
	const moveFolded = (e) => $PointerEventFolded("move", e.detail);
	const releaseFolded = (e) => $PointerEventFolded("release", e.detail);
	const scrollFolded = (e) => $ScrollEventFolded(e.detail);

	const keydown = (e) => $KeyboardEvent("down", e);
	const keyup = (e) => $KeyboardEvent("up", e);
</script>

<svelte:window
	on:keydown={keydown}
	on:keyup={keyup}
/>

<!-- <Stores /> -->
<Dialogs />
<FileManager />
<DragAndDrop />

<main class="vertical">
	{#if ShowMenu}
		<div class="menu">
			<Menu />
		</div>
	{/if}
	<div class="terminal">
		<Terminal />
	</div>
	<div class="gui horizontal">
		<div class="toolbar" role="toolbar">
			<Toolbar />
		</div>
		<div class="renderings vertical">
			<div class="canvases">
				<Canvases
					{pressCP}
					{moveCP}
					{releaseCP}
					{scrollCP}
					{pressFolded}
					{moveFolded}
					{releaseFolded}
					{scrollFolded} />
			</div>
			<div class="frames">
				<Frames />
			</div>
		</div>
		<div class="panels">
			<Panels />
		</div>
	</div>
</main>

<style>
	main {
		width: 100vw;
		height: 100vh;
		max-width: 100vw;
		max-height: 100vh;
		overflow: hidden;
		position: fixed;
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
	.menu {
		width: 100%;
		height: 2rem;
		flex: 0 0 auto;
	}
	.terminal {
		width: 100%;
		height: 6rem;
		flex: 0 1 auto;
	}
	.gui {
		width: 100%;
		flex: 1 1 auto;
		min-height: 0;
	}

	/* .gui children */
	.toolbar {
		height: 100%;
		flex: 0 0 auto;
		overflow-x: hidden;
		overflow-y: auto;
	}
	.renderings {
		width: 100%;
		height: 100%;
		min-width: 0;
		flex: 1 1 auto;
	}
	.panels {
		width: 16rem;
		height: 100%;
		flex: 0 0 auto;
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
		background-color: var(--background-1);
	}
	.panels {
		background-color: var(--background-1);
	}
</style>
