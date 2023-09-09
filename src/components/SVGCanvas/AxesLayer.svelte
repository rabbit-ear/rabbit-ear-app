<script>
	import { ViewBox } from "../../stores/ViewBox.js";
	let length = 1;
	$: length = Math.min($ViewBox[2], $ViewBox[3]) * 0.1;
</script>

<g>
	<line x1="0" y1="0" x2={length} y2="0" class="axis-marker-x" />
	<line x1="0" y1="0" x2="0" y2={length} class="axis-marker-y" />
</g>

<style>
	.axis-marker-x { stroke: var(--red); }
	.axis-marker-y { stroke: var(--green); }
</style>
