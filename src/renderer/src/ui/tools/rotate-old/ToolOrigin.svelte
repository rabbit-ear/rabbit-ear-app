<script>
	import state from "./state.svelte.ts";
	// import { renderer } from "../../stores/renderer.svelte.ts";

	const highlighted = $derived(state.fixedPoint ? state.fixedPoint.highlighted : false);
	const className = $derived(highlighted ? "highlighted" : "");
	const origin = $derived(state.fixedPoint ? state.fixedPoint.origin : [0, 0]);

	// todo
	const renderercircleRadius = 0.1;

	// svg elements
	const originCircle1 = $derived({
		cx: origin[0],
		cy: origin[1],
		// r: renderer.circleRadius * 1.5,
		r: renderercircleRadius * 1.5,
	});
	const originCircle2 = $derived({
		cx: origin[0],
		cy: origin[1],
		// r: renderer.circleRadius * 2,
		r: renderercircleRadius * 1.5,
	});
	const originLine1 = $derived({
		x1: origin[0],
		// y1: origin[1] - renderer.circleRadius * 3,
		y1: origin[1] - renderercircleRadius * 3,
		x2: origin[0],
		// y2: origin[1] + renderer.circleRadius * 3,
		y2: origin[1] + renderercircleRadius * 3,
	});
	const originLine2 = $derived({
		// x1: origin[0] - renderer.circleRadius * 3,
		x1: origin[0] - renderercircleRadius * 3,
		y1: origin[1],
		// x2: origin[0] + renderer.circleRadius * 3,
		x2: origin[0] + renderercircleRadius * 3,
		y2: origin[1],
	});
</script>

<circle {...originCircle1} class={className} />
<circle {...originCircle2} class={className} />
<line {...originLine1} class={className} />
<line {...originLine2} class={className} />

<style>
	circle {
		fill: none;
		stroke: var(--text);
	}
	line {
		fill: none;
		stroke: var(--text);
	}
	.highlighted {
		stroke: #fb4;
	}
</style>
