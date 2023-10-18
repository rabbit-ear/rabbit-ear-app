<script>
	import Panel from "./Panel.svelte";
	import FoldedFormLayers from "../PanelParts/FoldedFormLayers.svelte";
	import {
		IsolatedFrame,
		FrameEdgesAreFlat,
		FrameIsCreasePattern,
		Is3DFoldable,
		IsFlatFoldable,
	} from "../../stores/Model.js";

	export let showPanel;
</script>

<Panel {showPanel}>
	<span slot="title">Folded</span>
	<span slot="body">
		<div class="flex-column gap">

			<p>Edge angles are
				{#if $FrameEdgesAreFlat}
					<span class="strong">2D</span>
				{:else}
					<span class="strong">3D</span>
				{/if}
			</p>
				
			<p>Vertices are
				{#if $FrameEdgesAreFlat}
					{#if $IsFlatFoldable}
						<span class="good">flat-foldable</span>
					{:else}
						<span class="bad">not flat-foldable</span>
					{/if}
				{:else}
					{#if $Is3DFoldable}
						<span class="good">foldable</span>
					{:else}
						<span class="bad">not foldable</span>
					{/if}
				{/if}
			</p>

			<hr />

			<FoldedFormLayers />
		</div>
	</span>
</Panel>

<style>
	.good {
		font-weight: bold;
	}
	.bad {
		font-weight: bold;
		color: var(--red);
	}
	.strong {
		font-weight: bold;
	}
</style>
