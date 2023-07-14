<script>
	import { Tool, ToolStep } from "../../stores/Tool.js";
	// import { toolStep } from "../../stores/UI.js";
	import {
		TOOL_AXIOM_1,
		TOOL_AXIOM_2,
		TOOL_AXIOM_3,
		TOOL_AXIOM_4,
		TOOL_AXIOM_5,
		TOOL_AXIOM_6,
		TOOL_AXIOM_7,
	} from "../../app/keys.js";

	let classes = ["todo", "todo", "todo", "todo"];
	$: switch ($ToolStep) {
	case 0:
		classes[0] = "current";
		classes[1] = "todo";
		classes[2] = "todo";
		classes[3] = "todo";
		break;
	case 1:
		classes[0] = "done";
		classes[1] = "current";
		classes[2] = "todo";
		classes[3] = "todo";
		break;
	case 2:
		classes[0] = "done";
		classes[1] = "done";
		classes[2] = "current";
		classes[3] = "todo";
		break;
	case 3:
		classes[0] = "done";
		classes[1] = "done";
		classes[2] = "done";
		classes[3] = "current";
		break;
	}
</script>

<div class="container">
	{#if $Tool === TOOL_AXIOM_1}
		<ol>
			<li class={classes[0]}>press on a point</li>
			<li class={classes[1]}>release on a point</li>
		</ol>
	{:else if $Tool === TOOL_AXIOM_2}
		<ol>
			<li class={classes[0]}>press on a point</li>
			<li class={classes[1]}>release on a point</li>
		</ol>
	{:else if $Tool === TOOL_AXIOM_3}
		<ol>
			<li class={classes[0]}>press on a line</li>
			<li class={classes[1]}>release on a line</li>
		</ol>
	{:else if $Tool === TOOL_AXIOM_4}
		<ol>
			<li class={classes[0]}>press on a line</li>
			<li class={classes[1]}>release on a point</li>
		</ol>
	{:else if $Tool === TOOL_AXIOM_5}
		<ol>
			<li class={classes[0]}>press on a point</li>
			<li class={classes[1]}>release on a line</li>
			<li class={classes[2]}>press on a point</li>
		</ol>
	{:else if $Tool === TOOL_AXIOM_6}
		<ol>
			<li class={classes[0]}>press on a point</li>
			<li class={classes[1]}>release on a line</li>
			<li class={classes[2]}>press on a point</li>
			<li class={classes[3]}>release on a line</li>
		</ol>
	{:else if $Tool === TOOL_AXIOM_7}
		<ol>
			<li class={classes[0]}>press on a point</li>
			<li class={classes[1]}>release on a line</li>
			<li class={classes[2]}>press on a line</li>
		</ol>
	{/if}
</div>

<style>
	ol {
		list-style: decimal;
		padding-left: 1.2rem;
	}
	.container {
		display: flex;
		flex-direction: column;
	}
	.done { color: #444; }
	.current { color: #39c; }
	.todo { color: #bbb; }
</style>
