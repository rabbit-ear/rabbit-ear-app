<script>
	import Panel from "./Panel.svelte";
	import { Tool, ToolStep } from "../../stores/Tool.js";
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
	import ToolAxiom from "./ToolAxiom.svelte";
	import ToolNewEdgeAssignment from "./ToolNewEdgeAssignment.svelte";
</script>

<Panel>
	<span slot="title">{nameForTool[$Tool]}</span>
	<span slot="body">
		{#if $Tool === TOOL_SELECT}
			<ToolSelect />
		{:else if $Tool === TOOL_VERTEX}
			<p>new position</p>
		{:else if $Tool === TOOL_EDGE}
			<ToolNewEdgeAssignment />
			<p>between these</p>
		{:else if $Tool === TOOL_SPLIT_EDGE}
			<p>split count: 2 (1 new vertex)</p>
		{:else if $Tool === TOOL_TRANSLATE}
			<p>all axes</p>
		{:else if $Tool === TOOL_SCALE}
			<p>uniform</p>
		{:else if $Tool === TOOL_ASSIGN}
			<ToolAssign />
		{:else if $Tool === TOOL_FOLD_ANGLE}
			<ToolFoldAngle />
		{:else if $Tool.substring(0, 9) === "toolAxiom"}
			<ToolAxiom />
		{/if}
		<hr />
		<p>tool step {$ToolStep}</p>
	</span>
</Panel>
