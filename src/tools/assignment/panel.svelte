<script>
	import { AssignType } from "./stores.js";
	import {
		ASSIGN_SWAP,
		ASSIGN_FLAT,
		ASSIGN_UNASSIGNED,
		ASSIGN_CUT,
		ASSIGN_BOUNDARY,
	} from "../../app/keys.js";
</script>

<div class="container">
	<div>
		<input
			type="radio"
			id="swap"
			name="assignType"
			bind:group={$AssignType}
			value={ASSIGN_SWAP} >
		<label for="swap">mountain/valley</label>
	</div>
	<div>
		<input
			type="radio"
			id="flat"
			name="assignType"
			bind:group={$AssignType}
			value={ASSIGN_FLAT} >
		<label for="flat">flat</label>
	</div>
	<div>
		<input
			type="radio"
			id="unassigned"
			name="assignType"
			bind:group={$AssignType}
			value={ASSIGN_UNASSIGNED} >
		<label for="unassigned">unassigned</label>
	</div>
	<div>
		<input
			type="radio"
			id="cut"
			name="assignType"
			bind:group={$AssignType}
			value={ASSIGN_CUT} >
		<label for="cut">cut</label>
	</div>
	<div>
		<input
			type="radio"
			id="boundary"
			name="assignType"
			bind:group={$AssignType}
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
