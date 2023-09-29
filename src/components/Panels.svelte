<script>
	import Canvas from "./Panels/Canvas.svelte";
	import File from "./Panels/File.svelte";
	// import Frames from "./Panels/Frames.svelte";
	import ModifiersPanel from "./Panels/Modifiers.svelte";
	import Simulator from "./Panels/Simulator.svelte";
	import { Modifiers } from "../stores/Modifiers.js";
	import { ShowStaticOrSimulator } from "../stores/App.js";
	import { Tool } from "../stores/UI.js";

	let ModifierPanels;
	$: ModifierPanels = $Modifiers
		.filter(modifier => modifier.panel)
		.map(modifier => modifier.panel);
</script>

<Canvas />
{#if $Tool && $Tool.panel}
	<svelte:component this={$Tool.panel} />
{/if}
{#if $ShowStaticOrSimulator}
	<Simulator />
{/if}
<ModifiersPanel />
{#each ModifierPanels as panel}
	<svelte:component this={panel} />
{/each}
<File />
<!-- <Frames /> -->
