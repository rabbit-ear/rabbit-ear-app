<script>
	import Header from "./Header.svelte";
	import Footer from "./Footer.svelte";
	import Toolbar from "./Toolbar.svelte";
	import SVGCanvas from "./SVGCanvas/SVGCanvas.svelte";
	import Kernel from "./Kernel.svelte";
	import FileManager from "./FileManager.svelte";
	import DragAndDrop from "./DragAndDrop.svelte";

	let press;
	let move;
	let release;
	let keydownKernel;
	let keyupKernel;
	let keydownFooter;
</script>

<svelte:window
	on:keydown={keydownKernel}
	on:keyup={keyupKernel}
/>

<main>
	<Header />
	<div class="body">
		<Toolbar />
		<SVGCanvas on:press={press} on:move={move} on:release={release} />
	</div>
	<Footer bind:keydown={keydownFooter} />
	<Kernel
		bind:press={press}
		bind:move={move}
		bind:release={release}
		bind:keydown={keydownKernel}
		bind:keyup={keyupKernel}
	/>
	<FileManager />
	<DragAndDrop />
</main>

<style>
	main {
		width: 100%;
		height: 100vh;
	}
	.body {
		display: flex;
		flex-direction: row;
		height: calc(100vh - 8rem);
	}
</style>
