<script>
	import { Keyboard } from "../../stores/UI.js";
	import { RadialSnapDegrees } from "../../stores/Snap.js";
</script>

<div class="flex-column gap">
	<p class={$Keyboard[16] ? "highlight" : ""}>angle snap</p>
	<div class="flex-row">
		<input type="number" step="0.5" id="snapAngle" bind:value={$RadialSnapDegrees}>
		<label for="snapAngle">degrees</label>
	</div>
</div>

<style>
	input[type=number] {
		width: 6rem;
	}
	.highlight {
		font-weight: bold;
		color: var(--highlight);
	}
</style>
