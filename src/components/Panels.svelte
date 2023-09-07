<script>
	// import Tools from "./Panels/Tools.svelte";
	import File from "./Panels/File.svelte";
	import Canvas from "./Panels/Canvas.svelte";
	import History from "./Panels/History.svelte";
	// import RulerLines from "./Panels/RulerLines.svelte";
	import Simulator from "./Panels/Simulator.svelte";
	import { ShowSimulator } from "../stores/App.js";
	import { Tool } from "../stores/UI.js";
</script>

{#if $Tool && $Tool.panel}
	<svelte:component this={$Tool.panel} />
{/if}
<Canvas />
<!-- <RulerLines /> -->
{#if $ShowSimulator}
	<Simulator />
{/if}
<File />
<History />
