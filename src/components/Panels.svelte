<script>
	import File from "./Panels/File.svelte";
	import Frames from "./Panels/Frames.svelte";
	import Modifiers from "./Panels/Modifiers.svelte";
	import Canvas from "./Panels/Canvas.svelte";
	import History from "./Panels/History.svelte";
	import Debug from "./Panels/Debug.svelte";
	// import RulerLines from "./Panels/RulerLines.svelte";
	import Simulator from "./Panels/Simulator.svelte";
	import { ShowSimulator } from "../stores/App.js";
	import { Tool } from "../stores/UI.js";
</script>

<!-- <Debug /> -->
{#if $Tool && $Tool.panel}
	<svelte:component this={$Tool.panel} />
{/if}
<Canvas />
<!-- <RulerLines /> -->
{#if $ShowSimulator}
	<Simulator />
{/if}
<File />
<Frames />
<Modifiers />
<History />
