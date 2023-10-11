<script>
	import { createEventDispatcher } from "svelte";
	import SVGCanvas from "./SVGCanvas.svelte";
	import {
		convertToViewBox,
		findInParents,
	} from "../../js/dom.js";

	export let viewBox;
	export let strokeWidth = 0.001;
	export let invertVertical = false;
	export let scale = 1;

	const unwrap = (point) => [
		(1 / scale) * point[0],
		(1 / scale) * point[1] * (invertVertical ? -1 : 1),
	];

	const formatMouseEvent = (e) => ({
		buttons: e.buttons,
		point: unwrap(convertToViewBox(findInParents(e.target, "svg"), [e.x, e.y])),
	});

	const formatWheelEvent = (e) => ({
		wheelDelta: e.wheelDelta,
		point: convertToViewBox(findInParents(e.target, "svg"), [e.x, e.y]),
	});

	const dispatch = createEventDispatcher();
	const mousedown = (e) => dispatch("press", formatMouseEvent(e));
	const mousemove = (e) => dispatch("move", formatMouseEvent(e));
	const mouseup = (e) => dispatch("release", formatMouseEvent(e));
	const wheel = (e) => dispatch("scroll", formatWheelEvent(e));
</script>

<SVGCanvas
	on:mousedown={mousedown}
	on:mousemove={mousemove}
	on:mouseup={mouseup}
	on:wheel={wheel}
	{scale}
	{viewBox}
	{strokeWidth}
	{invertVertical}>
	<slot />
</SVGCanvas>
