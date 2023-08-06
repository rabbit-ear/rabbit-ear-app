<script>
	import Tools from "./Panels/Tools.svelte";
	import File from "./Panels/File.svelte";
	import Canvas from "./Panels/Canvas.svelte";
	import History from "./Panels/History.svelte";
	import RulerLines from "./Panels/RulerLines.svelte";
	import Simulator from "./Panels/Simulator.svelte";
	import { ShowSimulator } from "../stores/App.js";
</script>

<div class="container">
	<File />
	<Canvas />
	<Tools />
	<RulerLines />
	<History />
	{#if $ShowSimulator}
		<Simulator />
	{/if}
</div>

<style>
	.container {
		flex: 0 1 12rem;
		background-color: #333;
		overflow-y: auto;
	}
</style>
