<script>
	import Header from "./Header.svelte";
	import Toolbar from "./Toolbar.svelte";
	import SVGCanvas from "./Canvas/SVGCanvas.svelte";
	import GraphManager from "./GraphManager.svelte";

	let didPressAt;
</script>

<main>
	<Header />
	<div class="body">
		<Toolbar />
		<SVGCanvas on:press={didPressAt}/>
	</div>
	<GraphManager bind:didPressAt={didPressAt} />
</main>

<style>
	main {
		width: 100%;
		height: 100vh;
	}
	.body {
		display: flex;
		flex-direction: row;
		height: calc(100vh - 2rem);
	}
</style>
