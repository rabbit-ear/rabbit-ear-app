<script lang="ts">
  import ToolOrigin from "./ToolOrigin.svelte";
  import type { SVGViewport } from "../../../viewports/SVGViewport/SVGViewport.svelte.ts";
  import type { FixedPoint } from "../state/FixedPoint.svelte.ts";

  type PropsType = {
    viewport: SVGViewport;
    getFixedPoint: () => FixedPoint;
  };
  let { viewport, getFixedPoint }: PropsType = $props();
</script>

<ToolOrigin {viewport} {getFixedPoint} />
