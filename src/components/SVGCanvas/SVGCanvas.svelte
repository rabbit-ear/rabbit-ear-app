<script>
	export let viewBox = "0 0 1 1";
	export let strokeWidth = 0.001;
	export let invertVertical = false;
	export let scale = 1;

	$: matrix = [scale, 0, 0, invertVertical ? -scale : scale, 0, 0].join(", ");
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	role="presentation"
	stroke-width={strokeWidth}
	{viewBox}
	on:mousedown
	on:mousemove
	on:mouseup
	on:wheel
	on:focus={() => {}}
	on:blur={() => {}}>
	<g class="wrapper-layer" style={`transform: matrix(${matrix})`}>
		<slot />
	</g>
</svg>

<style>
	svg {
		width: 100%;
		height: 100%;
	}
</style>
