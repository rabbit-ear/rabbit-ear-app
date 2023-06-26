<script>
	import { assignType } from "../../stores/app.js";
	import {
		TOOL_SELECT,
		TOOL_VERTEX,
		TOOL_EDGE,
		TOOL_SPLIT_EDGE,
		TOOL_TRANSLATE,
		TOOL_SCALE,
		TOOL_ASSIGN,
		ASSIGN_SWAP,
		ASSIGN_FLAT,
		ASSIGN_UNASSIGNED,
		ASSIGN_CUT,
		ASSIGN_BOUNDARY,
		nameForTool,
	} from "../../app/keys.js";
</script>

<div class="container">
	<div>
		<input
			type="radio"
			id="swap"
			name="assignType"
			bind:group={$assignType}
			value={ASSIGN_SWAP} >
		<label for="swap">mountain/valley</label>
	</div>
	<div>
		<input
			type="radio"
			id="flat"
			name="assignType"
			bind:group={$assignType}
			value={ASSIGN_FLAT} >
		<label for="flat">flat</label>
	</div>
	<div>
		<input
			type="radio"
			id="unassigned"
			name="assignType"
			bind:group={$assignType}
			value={ASSIGN_UNASSIGNED} >
		<label for="unassigned">unassigned</label>
	</div>
	<div>
		<input
			type="radio"
			id="cut"
			name="assignType"
			bind:group={$assignType}
			value={ASSIGN_CUT} >
		<label for="cut">cut</label>
	</div>
	<div>
		<input
			type="radio"
			id="boundary"
			name="assignType"
			bind:group={$assignType}
			value={ASSIGN_BOUNDARY} >
		<label for="boundary">boundary</label>
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
	}
</style>
