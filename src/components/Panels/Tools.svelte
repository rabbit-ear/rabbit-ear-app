<script>
	import Panel from "./Panel.svelte";
	import { Tool, ToolStep } from "../../stores/Tool.js";
	import {
		TOOL_SELECT,
		TOOL_DELETE,
		TOOL_VERTEX,
		TOOL_EDGE,
		TOOL_SPLIT_EDGE,
		TOOL_TRANSLATE,
		TOOL_SCALE,
		TOOL_PLEAT,
		TOOL_ASSIGN,
		TOOL_FOLD_ANGLE,
		TOOL_SCRIBBLE,
		nameForTool,
	} from "../../app/keys.js";
	import ToolSelect from "./ToolSelect.svelte";
	import ToolAssign from "./ToolAssign.svelte";
	import ToolFoldAngle from "./ToolFoldAngle.svelte";
	import ToolAxiom from "./ToolAxiom.svelte";
	import ToolPleat from "./ToolPleat.svelte";
	import ToolScribble from "./ToolScribble.svelte";
	import NewEdgeAssignment from "./NewEdgeAssignment.svelte";
</script>

<Panel>
	<span slot="title">{nameForTool[$Tool]}</span>
	<span slot="body">
		<NewEdgeAssignment />
		<hr />
		{#if $Tool === TOOL_SELECT}
			<ToolSelect />
		{:else if $Tool === TOOL_DELETE}
			<ToolSelect />
		{:else if $Tool === TOOL_VERTEX}
			<p>new position</p>
		{:else if $Tool === TOOL_EDGE}
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
		{:else if $Tool === TOOL_PLEAT}
			<ToolPleat />
		{:else if $Tool === TOOL_SCRIBBLE}
			<ToolScribble />
		{:else if $Tool.substring(0, 9) === "toolAxiom"}
			<ToolAxiom />
		{/if}
		<hr />
		<p>tool step {$ToolStep}</p>
	</span>
</Panel>
