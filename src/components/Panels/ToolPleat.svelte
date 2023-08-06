<script>
import { PleatCount } from "../../stores/Tool.js";
</script>

<div class="container">
	<input
		type="text"
		bind:value={$PleatCount} >
</div>

<style>
	input[type=text] {
		width: 100%;
	}
	.container {
		display: flex;
		flex-direction: column;
	}
</style>
