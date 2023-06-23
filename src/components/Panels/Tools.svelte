<script>
	import Panel from "./Panel.svelte";
	import { tool } from "../../stores/app.js";
	import {
		TOOL_SELECT,
		TOOL_VERTEX,
		TOOL_EDGE,
		TOOL_SPLIT_EDGE,
		TOOL_TRANSLATE,
		TOOL_SCALE,
		nameForTool,
	} from "../../app/keys.js";
</script>

<Panel>
	<span slot="title">{nameForTool[$tool]}</span>

	<span slot="body">
		{#if $tool === TOOL_SELECT}
			<p>vertices</p>
			<p>edges</p>
			<p>faces</p>
		{:else if $tool === TOOL_VERTEX}
			<p>new position</p>
		{:else if $tool === TOOL_EDGE}
			<p>between these</p>
		{:else if $tool === TOOL_SPLIT_EDGE}
			<p>split count: 2 (1 new vertex)</p>
		{:else if $tool === TOOL_TRANSLATE}
			<p>all axes</p>
		{:else if $tool === TOOL_SCALE}
			<p>uniform</p>
		{/if}
	</span>
</Panel>