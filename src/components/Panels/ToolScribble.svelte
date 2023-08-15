<script>
	import {
		Presses,
		Moves,
		Releases,
	} from "../../stores/UI.js";
	import {
		ScribbleSmooth,
		ScribbleSmoothAmount,
		ScribbleDensity,
		ScribbleWaitForConfirmation,
	} from "../../stores/Tool.js";
	let pointCount;
	$: pointCount = $Presses.length + $Moves.length + $Releases.length;
</script>

<div class="container">
	<p>{pointCount} points</p>
	<hr />
	<div>
		<input type="checkbox" bind:checked={$ScribbleSmooth} id="smooth-checkbox"/><label for="smooth-checkbox">smooth</label>
	</div>
	<p>amount</p>
	<input disabled={!($ScribbleSmooth)} type="range" min="0" max="1" step="0.01" bind:value={$ScribbleSmoothAmount}>
	<p>point density</p>
	<input disabled={!($ScribbleSmooth)} type="range" min="0" max="1" step="0.01" bind:value={$ScribbleDensity}>
	<hr />
	<div>
		<input disabled={!($ScribbleSmooth)} type="checkbox" bind:checked={$ScribbleWaitForConfirmation} id="scribble-wait"><label for="scribble-wait">wait to confirm</label>
	</div>
	<button disabled={!($ScribbleSmooth) || !($ScribbleWaitForConfirmation)}>apply scribble</button>
	{#if $ScribbleWaitForConfirmation}
		<p class="info">press button when ready</p>
	{:else}
		<p class="info">applied upon release</p>
	{/if}
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
	}
	.info {
		font-style: italic;
		color: var(--dim);
	}
	hr { width: 100%; }
</style>
