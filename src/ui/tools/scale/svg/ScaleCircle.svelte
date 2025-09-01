<script lang="ts">
  import { magnitude2, subtract2 } from "rabbit-ear/math/vector.js";
  import type { SVGViewport } from "../../../viewports/SVGViewport/SVGViewport.svelte.ts";
  import type { Anchor } from "../state/Anchor.svelte.ts";

  type PropsType = {
    viewport: SVGViewport;
    getStartVector: () => [number, number] | undefined;
    getEndVector: () => [number, number] | undefined;
    getIsPressed: () => boolean;
    getAnchor: () => Anchor;
  };
  let { viewport, getAnchor, getStartVector, getEndVector, getIsPressed }: PropsType =
    $props();

  const fixedOrigin = $derived(getAnchor().origin);
  const origin: [number, number] = $derived([
    !isNaN(fixedOrigin[0]) && isFinite(fixedOrigin[0]) ? fixedOrigin[0] : 0,
    !isNaN(fixedOrigin[1]) && isFinite(fixedOrigin[1]) ? fixedOrigin[1] : 0,
  ]);
  const startVector = $derived(getStartVector());
  const endVector = $derived(getEndVector());
  const valid = $derived(
    getIsPressed() && startVector && endVector && origin && !getAnchor().selected,
  );
  const startR = $derived(startVector ? magnitude2(startVector) : 0);
  const endR = $derived(endVector ? magnitude2(endVector) : 0);

  const innerCircle = $derived({
    cx: origin[0],
    cy: origin[1],
    r: startR,
  });

  const outerCircle = $derived({
    cx: origin[0],
    cy: origin[1],
    r: endR,
  });

  // const vLine = $derived([
  //   [origin[0], origin[1] - viewport.style.circleRadius * bigR],
  //   [origin[0], origin[1] + viewport.style.circleRadius * bigR],
  // ]);
  //
  // const hLine = $derived([
  //   [origin[0] - viewport.style.circleRadius * bigR, origin[1]],
  //   [origin[0] + viewport.style.circleRadius * bigR, origin[1]],
  // ]);

  // const path = $derived({
  //   d: `M${vLine[0].join(",")}L${vLine[1].join(",")}M${hLine[0].join(",")}L${hLine[1].join(",")}`,
  // });
</script>

{#if valid}
  <circle {...innerCircle} />
  <circle {...outerCircle} />

  <!-- <path {...path} /> -->
{/if}

<style>
  circle {
    fill: none;
    stroke: var(--dim);
  }
  path {
    fill: none;
    stroke: var(--text);
  }
  .highlighted {
    stroke: var(--yellow);
  }
</style>
