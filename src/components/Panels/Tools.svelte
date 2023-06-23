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
		{:else if $tool === TOOL_EDGE}
		{:else if $tool === TOOL_SPLIT_EDGE}
		{:else if $tool === TOOL_TRANSLATE}
		{:else if $tool === TOOL_SCALE}
		{/if}
	</span>
</Panel>