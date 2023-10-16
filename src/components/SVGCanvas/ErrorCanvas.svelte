<script>
	export let message = "";
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	role="presentation"
	viewBox="0 0 100 100">
	<text font-size="10" x="50" y="50">{message}</text>
</svg>

<style>
	svg {
		width: 100%;
		height: 100%;
		margin: auto;
	}
	text {
		font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
		fill: var(--background-4);
		text-anchor: middle;
		dominant-baseline: middle;
		text-align: center;
		pointer-events: none;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
</style>
