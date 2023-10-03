<script>
	import SVGCanvas from "./SVGCanvas.svelte";
	import GridLayer from "./GridLayer.svelte";
	import UILayer from "./UILayer.svelte";
	import FacesFoldedLayer from "./FacesFoldedLayer.svelte";
	import RulerLayer from "./RulerLayer.svelte";
	import AxesLayer from "./AxesLayer.svelte";
	import GraphIndices from "./GraphIndices.svelte";
	import FlatFoldable from "./FlatFoldable.svelte";
	import { FoldedForm } from "../../stores/Model.js";
	import {
		ShowGrid,
		ShowAxes,
		ShowIndices,
	} from "../../stores/App.js";
	import { Selection } from "../../stores/Select.js";
	import { Highlight } from "../../stores/UI.js";
	import { StrokeWidthFoldedForm } from "../../stores/Style.js";
	import { ViewBoxFolded } from "../../stores/ViewBox.js";
</script>

<SVGCanvas
	viewBox={$ViewBoxFolded}
	strokeWidth={$StrokeWidthFoldedForm}
	on:press
	on:move
	on:release
	on:scroll>
	{#if $ShowGrid}
		<GridLayer viewBox={$ViewBoxFolded} />
	{/if}
	<g class="origami-layer">
		<FacesFoldedLayer
			graph={$FoldedForm}
			selected={$Selection.faces}
			highlighted={$Highlight.faces} />
	</g>
	{#if $ShowAxes}
		<AxesLayer viewBox={$ViewBoxFolded} />
	{/if}
	{#if $ShowIndices}
		<GraphIndices graph={$FoldedForm} />
	{/if}
</SVGCanvas>
