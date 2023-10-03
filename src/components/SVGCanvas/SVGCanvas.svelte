<script>
	import { createEventDispatcher } from "svelte";
	import {
		convertToViewBox,
		findInParents,
	} from "../../js/dom.js";

	const formatMouseEvent = (e) => ({
		buttons: e.buttons,
		point: convertToViewBox(findInParents(e.target, "svg"), e.x, e.y),
	});

	const formatWheelEvent = (e) => ({
		wheelDelta: e.wheelDelta, // wheelDeltaX, wheelDeltaY
		point: convertToViewBox(findInParents(e.target, "svg"), e.x, e.y),
	});

	const dispatch = createEventDispatcher();
	const mousedown = (e) => dispatch("press", formatMouseEvent(e));
	const mousemove = (e) => dispatch("move", formatMouseEvent(e));
	const mouseup = (e) => dispatch("release", formatMouseEvent(e));
	const wheel = (e) => dispatch("scroll", formatWheelEvent(e));

	export let viewBox = [0, 0, 1, 1];
	export let strokeWidth = 0.001;

	const padViewBox = (box) => {
		const pad = Math.max(box[2], box[3]) * 0.05;
		return [box[0] - pad, box[1] - pad, box[2] + pad * 2, box[3] + pad * 2];
	};
</script>

<!-- i'm not sure what role=presentation means, i just guessed -->

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox={padViewBox(viewBox).join(" ")}
	stroke-width={strokeWidth}
	on:mousedown={mousedown}
	on:mousemove={mousemove}
	on:mouseup={mouseup}
	on:wheel={wheel}
	on:focus={() => {}}
	on:blur={() => {}}
	role="presentation" >
	<g class="wrapper-layer">
		<slot />
	</g>
</svg>

<style>
	svg {
		width: 100%;
		height: 100%;
	}
	.wrapper-layer {
/*		transform: scale(100, 100);*/
/*		transform: matrix(1, 0, 0, -1, 0, 1);*/
	}
</style>
