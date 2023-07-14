<script>
	import GraphVerticesLayer from "./GraphVerticesLayer.svelte";
	import GraphEdgesLayer from "./GraphEdgesLayer.svelte";
	import GraphFacesLayer from "./GraphFacesLayer.svelte";
	import { ViewBox } from "../../stores/ViewBox.js";
	import { SelectionRect } from "../../stores/Select.js";
	import { UIGraph } from "../../stores/Graph.js";

	let vmax;
	$: vmax = Math.max($ViewBox[2], $ViewBox[3]);

	let tick = 0
	setInterval(() => { tick += (vmax * 0.002); }, 30);
</script>

<g>
	<g opacity="0.666">
		<GraphFacesLayer graph={$UIGraph} />
		<GraphEdgesLayer graph={$UIGraph} />
		<GraphVerticesLayer graph={$UIGraph} />
	</g>
	{#if $SelectionRect !== undefined}
		<rect
			x={$SelectionRect.min[0]}
			y={$SelectionRect.min[1]}
			width={$SelectionRect.span[0]}
			height={$SelectionRect.span[1]}
			fill="none"
			stroke="#fff8"
			stroke-dasharray={[vmax * 0.01, vmax * 0.01].join(" ")}
			stroke-dashoffset={tick}
		/>
	{/if}
</g>
