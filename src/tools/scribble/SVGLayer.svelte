<script>
	import { Polyline } from "./stores.js";

	let scribblePointString = "";
	$: scribblePointString = $Polyline.map(p => p.join(",")).join(" ");
</script>

{#if scribblePointString !== ""}
	<polyline points={scribblePointString} class="animated-dashed-line" />
{/if}

<style>
	polyline {
		fill: none;
		stroke: #fb4;
	}
</style>
