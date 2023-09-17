<script>
	import { BoundaryColor } from "../../stores/Style.js";
	export let index = 0;
	export let x = 0;
	export let y = 0;
	export let fontSize = 0.1;
	export let name = "vertices";
</script>

<g class={`${name}-indices`}
	style={`transform: matrix(1, 0, 0, -1, ${x}, ${y})`} >
	<circle cx={0} cy={0} r={fontSize * 0.75} stroke={$BoundaryColor} />
	<text
		x={0}
		y={0}
		style={`font-size: ${fontSize}px;`}>{index}</text>
</g>

<style>
	circle {
		fill: var(--background-1);
	}
	text {
		fill: var(--text);
		text-anchor: middle;
		dominant-baseline: central;
	}
</style>
