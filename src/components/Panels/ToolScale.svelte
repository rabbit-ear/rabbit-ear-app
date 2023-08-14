<script>
	import { execute } from "../../kernel/app.js";
	let scaleFactor = 1;
</script>

<input
	type="number"
	id="scaleValue"
	bind:value={scaleFactor} >
<label for="scaleValue">scale</label>

<button on:click={() => execute("scale", scaleFactor)}>apply</button>

<style>
	input {
		width: 100%;
	}
</style>
