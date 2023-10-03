<script>
	export let viewBox = [0, 0, 1, 1];

	let length = 1;
	$: length = Math.min(viewBox[2], viewBox[3]) * 0.1;
</script>

<g class="axis-layer">
	<line x1="0" y1="0" x2={length} y2="0" class="axis-marker-x" />
	<line x1="0" y1="0" x2="0" y2={length} class="axis-marker-y" />
</g>

<style>
	.axis-marker-x { stroke: var(--red); }
	.axis-marker-y { stroke: var(--green); }
</style>
