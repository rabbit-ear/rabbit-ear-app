<script>
	import { onMount } from "svelte";
	import Menu from "./Menu/Menu.svelte";
	import Terminal from "./Terminal.svelte";
	import Toolbar from "./Toolbar.svelte";
	import Canvases from "./Canvases.svelte";
	import Panels from "./Panels.svelte";
	import Frames from "./Frames.svelte";
	import Dialogs from "./Dialogs.svelte";
	// import DragAndDrop from "./DragAndDrop.svelte";
	import {
		ShowMenu,
		DialogNewFrame,
	} from "../stores/App.js";
	import { KeyboardEvent } from "../stores/KeyboardEvents.js";
	import {
		PointerEventCP,
		PointerEventFolded,
		ScrollEventCP,
		ScrollEventFolded,
	} from "../stores/TouchEvents.js";
	import {
		OnBootFOLD,
		LoadFOLDFile,
	} from "../stores/File.js";

	const pressCP = (e) => $PointerEventCP("press", e.detail);
	const moveCP = (e) => $PointerEventCP("move", e.detail);
	const releaseCP = (e) => $PointerEventCP("release", e.detail);
	const exitCP = (e) => $PointerEventCP("exit", e.detail);
	const scrollCP = (e) => $ScrollEventCP(e.detail);

	const pressFolded = (e) => $PointerEventFolded("press", e.detail);
	const moveFolded = (e) => $PointerEventFolded("move", e.detail);
	const releaseFolded = (e) => $PointerEventFolded("release", e.detail);
	const exitFolded = (e) => $PointerEventFolded("exit", e.detail);
	const scrollFolded = (e) => $ScrollEventFolded(e.detail);

	const keydown = (e) => $KeyboardEvent("down", e);
	const keyup = (e) => $KeyboardEvent("up", e);

	// the toolbar's scrollbar will cover up the buttons, flexbox doesn't
	// give space to account for the scrollbar, we have to create a listener
	// and manually add the padding by setting a css variable.
	let divToolbar;
	let toolbarScrollbarWidth = 0;
	$: document.documentElement.style.setProperty(
		"--toolbar-scrollbar-width", `${toolbarScrollbarWidth}px`)

	onMount(() => {
		// on initial app load, load the default file
		// LoadFOLDFile($OnBootFOLD);
		// on initial app load, open the "new frame" dialog, start empty otherwise
		$DialogNewFrame.showModal();

		// toolbar scrollbar stuff
		const resizeObserver = new ResizeObserver(entries => {
			setTimeout(() => {
				toolbarScrollbarWidth = divToolbar.offsetWidth - divToolbar.clientWidth;
			}, 5);
		});
		resizeObserver.observe(divToolbar);
		return () => resizeObserver.unobserve(divToolbar);
	});
</script>

<svelte:window
	on:keydown={keydown}
	on:keyup={keyup}
/>

<Dialogs />
<!-- <DragAndDrop /> -->

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
		<div class="toolbar" role="toolbar" bind:this={divToolbar}>
			<Toolbar />
		</div>
		<div class="renderings vertical">
			<div class="canvases">
				<Canvases
					{pressCP}
					{moveCP}
					{releaseCP}
					{exitCP}
					{scrollCP}
					{pressFolded}
					{moveFolded}
					{releaseFolded}
					{exitFolded}
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
		width: calc(2rem * 2 + 0.15rem * 4 + var(--toolbar-scrollbar-width));
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

	/* disable text-style drag and highlight on the buttons */
	.toolbar, .toolbar :global(*) {
		-webkit-user-select: none;
		user-select: none;
	}
</style>
