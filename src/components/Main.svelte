<script>
	import Header from "./Header.svelte";
	import Footer from "./Footer.svelte";
	import Toolbar from "./Toolbar.svelte";
	import SVGCanvas from "./SVGCanvas/SVGCanvas.svelte";
	import Panels from "./Panels.svelte";
	import Kernel from "./Kernel.svelte";
	import FileManager from "./FileManager.svelte";
	import DragAndDrop from "./DragAndDrop.svelte";

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

<main>
	<Header />
	<div class="content">
		<Toolbar />
		<SVGCanvas
			on:press={press}
			on:move={move}
			on:release={release}
			on:scroll={scroll}
		/>
		<Panels />
	</div>
	<Footer />
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
	.content {
		display: flex;
		flex-direction: row;
		height: calc(100vh - 8rem);
	}
</style>
