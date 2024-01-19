<script>
	import SVGTouchCanvas from "./SVGTouchCanvas.svelte";
	import GridLayer from "./GridLayer.svelte";
	import VerticesLayer from "./VerticesLayer.svelte";
	import EdgesLayer from "./EdgesLayer.svelte";
	import FacesLayer from "./FacesLayer.svelte";
	import RulerLayer from "./RulerLayer.svelte";
	import AxesLayer from "./AxesLayer.svelte";
	import GraphIndices from "./GraphIndices.svelte";
	import { VerticalUp } from "../../stores/App.js";
	import { CPFacesWinding } from "../../stores/ModelCP.js";
	import {
		FoldedForm,
		FoldedFacesWinding,
		Faces2DDrawOrder,
	} from "../../stores/ModelFolded.js"
	import {
		ShowGrid,
		ShowAxes,
		ShowIndices,
	} from "../../stores/App.js";
	import { Selection } from "../../stores/Select.js";
	import {
		Tool,
		Highlight,
		GhostGraphFolded,
		GuideLinesFolded,
	} from "../../stores/UI.js";
	import {
		StrokeWidthFoldedForm,
		StrokeDashLengthFoldedForm,
		VertexRadiusFolded,
	} from "../../stores/Style.js";
	import { ViewportFolded } from "../../stores/ViewBox.js";
	import { RulersFolded } from "../../stores/Ruler.js";

	const padViewport = (view, pad) => {
		const p = Math.max(view[2], view[3]) * pad;
		return [view[0] - p, view[1] - p, view[2] + p * 2, view[3] + p * 2];
	};

	$: viewport = padViewport($ViewportFolded, 0.05);
	$: invertVertical = $VerticalUp;

	// $: textY = invertVertical
	// 	? -viewport[1] - viewport[3] / 2
	// 	: viewport[1] + viewport[3] / 2;
	// $: textTransform = `matrix(1, 0, 0, ${invertVertical ? -1 : 1}, ${viewport[0] + viewport[2] / 2}, ${textY})`;

	let showRulers = true;
	$: showRulers = $Tool
		&& $Tool.name !== "edge"
		&& $Tool.name !== "folded line"

	$: rulers = showRulers ? $RulersFolded.concat($GuideLinesFolded) : [];
</script>

<SVGTouchCanvas
	viewBox={viewport.join(" ")}
	strokeWidth={$StrokeWidthFoldedForm}
	{invertVertical}
	on:press
	on:move
	on:release
	on:exit
	on:scroll>
	{#if $ShowGrid}
		<GridLayer {viewport} />
	{/if}
	<!-- <g class="origami-layer"> -->
	<FacesLayer
		graph={$FoldedForm}
		winding={$CPFacesWinding}
		frontBack={$FoldedFacesWinding}
		drawOrder={$Faces2DDrawOrder}
		selected={$Selection.faces}
		highlighted={$Highlight.faces} />
	<g class="hide-edges">
		<EdgesLayer
			graph={$FoldedForm}
			selected={$Selection.edges}
			highlighted={$Highlight.edges}
			strokeWidth={$StrokeWidthFoldedForm}
			strokeDasharray={$StrokeDashLengthFoldedForm}
			/>
	</g>
	<!-- </g> -->
	{#if $ShowAxes}
		<AxesLayer {viewport} />
	{/if}
	<g class="layer-tools" style={`--stroke-dash-length: ${$StrokeDashLengthFoldedForm};`}>
		<RulerLayer {viewport} {rulers} />
		<g class="graph-preview-layer">
			<FacesLayer graph={$GhostGraphFolded} />
			<EdgesLayer
				graph={$GhostGraphFolded}
				strokeWidth={$StrokeWidthFoldedForm * 3}
				strokeDasharray={$StrokeDashLengthFoldedForm}
			/>
			<VerticesLayer
				graph={$GhostGraphFolded}
				radius={$VertexRadiusFolded}
			/>
		</g>
		{#if $Tool && $Tool.folded && $Tool.folded.SVGLayer}
			<svelte:component this={$Tool.folded.SVGLayer} />
		{/if}
	</g>
	{#if $ShowIndices}
		<GraphIndices graph={$FoldedForm} {invertVertical} />
	{/if}
</SVGTouchCanvas>
