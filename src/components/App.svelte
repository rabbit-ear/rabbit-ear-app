<script>
	import Header from "./Header.svelte";
	import Footer from "./Footer.svelte";
	import Toolbar from "./Toolbar.svelte";
	import SVGCanvas from "./Canvas/SVGCanvas.svelte";
	import Kernel from "./Kernel.svelte";

	let press;
	let move;
	let release;
	let keydown;
</script>

<main>
	<Header />
	<div class="body">
		<Toolbar />
		<SVGCanvas on:press={press} on:move={move} on:release={release} />
	</div>
	<Footer bind:keydown={keydown} />
	<Kernel
		bind:press={press}
		bind:move={move}
		bind:release={release}
	/>
</main>

<!-- <svelte:window on:keydown={keydown} /> -->

<style>
	main {
		width: 100%;
		height: 100vh;
	}
	.body {
		display: flex;
		flex-direction: row;
		height: calc(100vh - 4rem);
	}
</style>
