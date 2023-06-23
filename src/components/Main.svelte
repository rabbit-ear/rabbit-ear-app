<script>
	import Header from "./Header.svelte";
	import Footer from "./Footer.svelte";
	import Toolbar from "./Toolbar.svelte";
	import SVGCanvas from "./SVGCanvas/SVGCanvas.svelte";
	import Simulator from "./OrigamiSimulator/Simulator.svelte";
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
		<div class="pair">
			<div>
				<SVGCanvas
					on:press={press}
					on:move={move}
					on:release={release}
					on:scroll={scroll}
				/>
			</div>
			<div>
				<Simulator />
			</div>
		</div>
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
	.pair {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 100%;
		flex: 1 0 calc(100vw - 8rem - 12rem);
	}
	.pair > * {
		width: 50%;
		height: 100%;
	}
</style>
