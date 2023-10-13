<script>
	import Panel from "./Panel.svelte";
	import FoldedFormLayers from "../PanelParts/FoldedFormLayers.svelte";
	import {
		IsolatedFrame,
		FrameEdgesAreFlat,
		FrameIsCreasePattern,
		VerticesFlatFoldable,
	} from "../../stores/Model.js";
	import { Prefer3D } from "../../stores/App.js";

	export let showPanel;
</script>

<Panel {showPanel}>
	<span slot="title">Folded</span>
	<span slot="body">
		<div class="flex-column gap">

			<div class="toggle-row center">
				<button
					highlighted={!$Prefer3D}
					on:click={() => $Prefer3D = false}>2D</button>
				<button
					highlighted={$Prefer3D}
					on:click={() => $Prefer3D = true}>3D</button>
			</div>

			<hr />

			<p>Vertices are
				{#if $VerticesFlatFoldable && $FrameEdgesAreFlat}
					<span class="good">flat-foldable</span>
				{:else}
					<span class="bad">not flat-foldable</span>
				{/if}
			</p>
			{#if $FrameEdgesAreFlat}
				<p>All edges are flat</p>
			{:else}
				<p>Some edges are <span class="strong">3D</span></p>
			{/if}
			<p>Folded state is <span class="strong">{$FrameEdgesAreFlat ? "2D" : "3D"}</span></p>
			<hr />
			<FoldedFormLayers />
		</div>
	</span>
</Panel>

<style>
	.good {
	}
	.bad {
		font-weight: bold;
		color: var(--red);
	}
	.strong {
		font-weight: bold;
	}
</style>
