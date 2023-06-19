<script>
	import { graph } from "../../stores/graph.js";
	import { selected } from "../../stores/select.js";
	import {
		viewBox,
		elementSelect,
		tool,
	} from "../../stores/app.js";
	import {
		SELECT_VERTEX,
		TOOL_VERTEX,
		TOOL_SPLIT_EDGE,
	} from "../../js/enums.js";

	let r;
	$: r = Math.max($viewBox[2], $viewBox[3]) * 0.01;

	let showVertices;
	$: showVertices = ($elementSelect === SELECT_VERTEX
		|| $tool === TOOL_SPLIT_EDGE
		|| $tool === TOOL_VERTEX);
</script>

	{#if showVertices}
		{#each $graph.vertices_coords as vertex, v}
			{#if $selected.vertices[v]}
				<circle r={r} cx={vertex[0]} cy={vertex[1]} stroke="none" fill="#fb4" />
			{:else}
				<circle r={r} cx={vertex[0]} cy={vertex[1]} stroke="none" fill="#aaa" />
			{/if}
		{/each}
	{/if}
