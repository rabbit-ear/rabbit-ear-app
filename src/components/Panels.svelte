<script>
	import Tools from "./Panels/Tools.svelte";
	import Canvas from "./Panels/Canvas.svelte";
	import RulerLines from "./Panels/RulerLines.svelte";
	import Simulator from "./Panels/Simulator.svelte";
</script>

<div class="container">
	<Canvas />
	<Tools />
	<RulerLines />
	<Simulator />
</div>

<style>
	.container {
		flex: 0 1 12rem;
		background-color: #333;
		overflow-y: auto;
	}
</style>
