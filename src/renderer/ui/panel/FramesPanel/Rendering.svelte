<script lang="ts">
  import type { FOLD } from "rabbit-ear/types.js";
  import SVGCanvas from "../../components/SVG/SVGCanvas.svelte";
  //import SVGFOLDVertices from "../../components/SVG/SVGFOLDVertices.svelte";
  import SVGFOLDEdges from "../../components/SVG/SVGFOLDEdges.svelte";
  import SVGFOLDFaces from "../../components/SVG/SVGFOLDFaces.svelte";
  import Settings from "../../../app/Settings.svelte.ts";
  const rightHanded = $derived(Settings.rightHanded);
  import { View } from "./View.svelte.ts";

  let { graph }: { graph: FOLD } = $props();

  const view = $derived(new View(graph));

  const matrix = $derived(rightHanded ? [1, 0, 0, -1, 0, 0].join(", ") : undefined);
  const strokeWidth = $derived(view.vmax * 0.02);
</script>

<SVGCanvas viewBox={view.viewBoxString} stroke-width={strokeWidth}>
  {#if matrix}
    <g class="wrapper" style="transform: matrix({matrix})">
      <!-- <SVGFOLDVertices {graph} /> -->
      <SVGFOLDEdges {graph} />
      <SVGFOLDFaces {graph} />
    </g>
  {:else}
    <!-- <SVGFOLDVertices {graph} /> -->
    <SVGFOLDEdges {graph} />
    <SVGFOLDFaces {graph} />
  {/if}
</SVGCanvas>
