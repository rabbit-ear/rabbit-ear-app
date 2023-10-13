<script>
	import Canvas from "./Panels/Canvas.svelte";
	import File from "./Panels/File.svelte";
	import ModifiersPanel from "./Panels/Modifiers.svelte";
	import StylePanel from "./Panels/Style.svelte";
	import FoldedForm from "./Panels/FoldedForm.svelte";
	import Simulator from "./Panels/Simulator.svelte";
	import { Modifiers } from "../stores/Modifiers.js";
	import {
		ShowPanelCanvas,
		ShowPanelTool,
		ShowPanelSimulator,
		ShowPanelFoldedForm,
		ShowPanelFile,
		ShowPanelStylePanel,
		ShowPanelModifiersPanel,
		ShowStaticOrSimulator,
	} from "../stores/App.js";
	import { Tool } from "../stores/UI.js";

	let ModifierPanels;
	$: ModifierPanels = $Modifiers
		.filter(modifier => modifier.panel)
		.map(modifier => modifier.panel);
</script>

<Canvas showPanel={$ShowPanelCanvas} />

{#if $Tool && $Tool.panel}
	<svelte:component this={$Tool.panel} showPanel={$ShowPanelTool} />
{/if}

{#if $ShowStaticOrSimulator}
	<Simulator showPanel={$ShowPanelSimulator} />
{:else}
	<FoldedForm showPanel={$ShowPanelFoldedForm} />
{/if}

<File showPanel={$ShowPanelFile} />

<StylePanel showPanel={$ShowPanelStylePanel} />

<ModifiersPanel showPanel={$ShowPanelModifiersPanel} />

{#each ModifierPanels as panel}
	<svelte:component this={panel} />
{/each}
