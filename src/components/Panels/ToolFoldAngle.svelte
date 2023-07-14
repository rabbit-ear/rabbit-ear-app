<script>
	import { FoldAngleValue } from "../../stores/Tool.js";
</script>

<div class="container">
	<input
		type="text"
		bind:value={$FoldAngleValue} >
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
	}
</style>
