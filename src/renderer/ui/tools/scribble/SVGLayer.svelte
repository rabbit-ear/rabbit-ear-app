<script lang="ts">
	import type { SVGViewport } from "../../viewport/SVGViewport/SVGViewport.svelte.ts";

	type PropsType = {
		path: string | undefined;
		viewport: SVGViewport;
	};
	let { path, viewport }: PropsType = $props();
</script>

{#if path}
	<path d={path} />
{/if}

<style>
	@keyframes animate-dash {
		from {
			stroke-dashoffset: 0;
		}
		to {
			stroke-dashoffset: calc(500pt * var(--stroke-dash-length));
		}
	}
	path {
		fill: none;
		stroke: var(--text);
		stroke-dasharray: var(--stroke-dash-length);
		animation: 60s linear 0s infinite reverse both running animate-dash;
	}
</style>
