<script>
	import Panel from "./Panel.svelte";
	import FoldedFormLayers from "../PanelParts/FoldedFormLayers.svelte";
	import {
		IsolatedFrame,
		FrameEdgesAreFlat,
		FrameIsCreasePattern,
		VerticesFlatFoldable,
	} from "../../stores/Model.js";
</script>

<Panel>
	<span slot="title">Folded</span>
	<span slot="body">
		<div class="flex-column gap">

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
			<!-- <hr />
			<div class="toggle-row center">
				<button>svg</button>
				<button>webgl</button>
			</div> -->
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
	.highlight {
		font-weight: bold;
		color: var(--highlight);
	}
</style>
