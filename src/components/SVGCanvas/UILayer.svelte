<script>
	import GraphVerticesLayer from "./GraphVerticesLayer.svelte";
	import GraphEdgesLayer from "./GraphEdgesLayer.svelte";
	import GraphFacesLayer from "./GraphFacesLayer.svelte";
	import { viewBox } from "../../stores/app.js";
	import { selectionRect } from "../../stores/select.js";
	import { uiGraph } from "../../stores/graph.js";

	let vmax;
	$: vmax = Math.max($viewBox[2], $viewBox[3]);

	let tick = 0
	setInterval(() => { tick += (vmax * 0.002); }, 30);
</script>

<g>
	<GraphFacesLayer graph={$uiGraph} />
	<GraphEdgesLayer graph={$uiGraph} />
	<GraphVerticesLayer graph={$uiGraph} />
	{#if $selectionRect !== undefined}
		<rect
			x={$selectionRect.min[0]}
			y={$selectionRect.min[1]}
			width={$selectionRect.span[0]}
			height={$selectionRect.span[1]}
			fill="none"
			stroke="#fff8"
			stroke-dasharray={[vmax * 0.01, vmax * 0.01].join(" ")}
			stroke-dashoffset={tick}
		/>
	{/if}
</g>
