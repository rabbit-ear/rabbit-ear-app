<script lang="ts">
	import type { SVGViewport } from "../../viewport/SVGViewport.svelte.ts";

	type PropsType = {
		viewport: SVGViewport,
	}
	let {
		viewport,
	}: PropsType = $props();
</script>

<style>
</style>
