<script lang="ts">
  import ToolOrigin from "./ToolOrigin.svelte";
  import ScaleCircle from "./ScaleCircle.svelte";
  import type { SVGViewport } from "../../../viewports/SVGViewport/SVGViewport.svelte.ts";
  import type { Anchor } from "../state/Anchor.svelte.ts";

  type PropsType = {
    viewport: SVGViewport;
    getAnchor: () => Anchor;
    getStartVector: () => [number, number] | undefined;
    getEndVector: () => [number, number] | undefined;
    getIsPressed: () => boolean;
  };
  let { viewport, getAnchor, getStartVector, getEndVector, getIsPressed }: PropsType =
    $props();
</script>

<ToolOrigin {viewport} {getAnchor} />
<ScaleCircle {viewport} {getAnchor} {getStartVector} {getEndVector} {getIsPressed} />
