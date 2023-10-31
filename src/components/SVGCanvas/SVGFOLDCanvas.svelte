<script>
	// on par with CreasePattern or FoldedForm,
	// this will show a FOLD object, but without any interaction.
	// a simple FOLD rendering as an SVG.
	import SVGCanvas from "./SVGCanvas.svelte";
	import EdgesLayer from "./EdgesLayer.svelte";
	import FacesLayer from "./FacesLayer.svelte";
	import { getFOLDViewport } from "../../js/matrix.js";

	export let graph = {};
	export let invertVertical = false;

	$: viewport = getFOLDViewport(graph, invertVertical);
	$: viewBox = viewport.join(" ");
	$: strokeWidth = viewport
		? 0.01 * Math.max(viewport[2], viewport[3])
		: 0.01;
	$: strokeDasharray = strokeWidth * 3;
</script>

<SVGCanvas {viewBox} {strokeWidth} {invertVertical}>
	<FacesLayer {graph} />
	<EdgesLayer {graph} {strokeWidth} {strokeDasharray} />
</SVGCanvas>
