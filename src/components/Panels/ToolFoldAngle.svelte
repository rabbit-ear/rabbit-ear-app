<script>
	import { foldAngleValue } from "../../stores/tool.js";
</script>

<div class="container">
	<input
		type="text"
		bind:value={$foldAngleValue} >
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
	}
</style>
