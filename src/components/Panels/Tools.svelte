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
		TOOL_ASSIGN,
		TOOL_FOLD_ANGLE,
		nameForTool,
	} from "../../app/keys.js";
	import ToolSelect from "./ToolSelect.svelte";
	import ToolAssign from "./ToolAssign.svelte";
	import ToolFoldAngle from "./ToolFoldAngle.svelte";
</script>

<Panel>
	<span slot="title">{nameForTool[$tool]}</span>
	<span slot="body">
		{#if $tool === TOOL_SELECT}
			<ToolSelect />
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
		{:else if $tool === TOOL_ASSIGN}
			<ToolAssign />
		{:else if $tool === TOOL_FOLD_ANGLE}
			<ToolFoldAngle />
		{/if}
	</span>
</Panel>
