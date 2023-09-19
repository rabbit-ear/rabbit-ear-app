<script>
	import File from "./Panels/File.svelte";
	import Frames from "./Panels/Frames.svelte";
	import ModifiersPanel from "./Panels/Modifiers.svelte";
	import Canvas from "./Panels/Canvas.svelte";
	// import Debug from "./Panels/Debug.svelte";
	// import RulerLines from "./Panels/RulerLines.svelte";
	import Simulator from "./Panels/Simulator.svelte";

	import { Modifiers } from "../stores/Modifiers.js";
	import { ShowSimulator } from "../stores/App.js";
	import { Tool } from "../stores/UI.js";

	let ModifierPanels;
	$: ModifierPanels = $Modifiers
		.filter(modifier => modifier.panel)
		.map(modifier => modifier.panel);
</script>

<!-- <Debug /> -->
<!-- <RulerLines /> -->
{#if $Tool && $Tool.panel}
	<svelte:component this={$Tool.panel} />
{/if}
<Canvas />
{#if $ShowSimulator}
	<Simulator />
{/if}
<File />
<Frames />
<ModifiersPanel />
{#each ModifierPanels as panel}
	<svelte:component this={panel} />
{/each}
