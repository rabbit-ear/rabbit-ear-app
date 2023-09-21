<script>
	import { Keyboard } from "../../stores/UI.js";
	import { RadialSnapDegrees } from "../../stores/Snap.js";
</script>

<p>snap edge to angle</p>
<input type="number" step="0.5" id="snapAngle" bind:value={$RadialSnapDegrees}><label for="snapAngle">degrees</label>
{#if $Keyboard[16]}
	<p><span class="highlight">shift</span> key</p>
{:else}
	<p>shift key</p>
{/if}

<style>
	input[type=number] {
		width: 6rem;
	}
	.highlight {
		color: var(--highlight);
	}
</style>
