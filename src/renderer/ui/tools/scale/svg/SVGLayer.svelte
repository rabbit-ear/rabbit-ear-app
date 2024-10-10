<script lang="ts">
  import ToolOrigin from "./ToolOrigin.svelte";
  import type { SVGViewport } from "../../../viewport/SVGViewport/SVGViewport.svelte.ts";
  import type { SVGFixedPoint } from "./SVGViewportState.svelte.ts";

  type PropsType = {
    viewport: SVGViewport;
    fixedPoint: SVGFixedPoint;
  };
  let { viewport, fixedPoint }: PropsType = $props();
</script>

<ToolOrigin {viewport} {fixedPoint} />
