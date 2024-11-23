<script lang="ts">
  import type { FOLD } from "rabbit-ear/types.js";
  import type { ModelStyle } from "../../../model/ModelStyle.ts";
  import SVGCanvas from "../../components/SVG/SVGCanvas.svelte";
  //import SVGFOLDVertices from "../../components/SVG/SVGFOLDVertices.svelte";
  import SVGFOLDEdges from "../../components/SVG/SVGFOLDEdges.svelte";
  import SVGFOLDFaces from "../../components/SVG/SVGFOLDFaces.svelte";
  import Settings from "../../../app/Settings.svelte.ts";
  const rightHanded = $derived(Settings.rightHanded);
  import { View } from "./View.svelte.ts";

  let { graph, frameStyle }: { graph: FOLD; frameStyle: ModelStyle } = $props();

  const view = $derived(new View(graph));

  const matrix = $derived(rightHanded ? [1, 0, 0, -1, 0, 0].join(", ") : undefined);
  const strokeWidth = $derived(view.vmax * 0.02);
  const isFoldedForm = $derived(frameStyle?.isFoldedForm);
  //const dimension = $derived(frameStyle?.dimension);
  const className = $derived(isFoldedForm ? "foldedForm" : "creasePattern");
</script>

<SVGCanvas class={className} viewBox={view.viewBoxString} stroke-width={strokeWidth}>
  {#if matrix}
    <g class="wrapper" style="transform: matrix({matrix})">
      <!-- <SVGFOLDVertices {graph} /> -->
      {#if !isFoldedForm}
        <SVGFOLDEdges {graph} />
      {:else}
        <SVGFOLDFaces {graph} />
      {/if}
    </g>
  {:else}
    <!-- <SVGFOLDVertices {graph} /> -->
    {#if !isFoldedForm}
      <SVGFOLDEdges {graph} />
    {:else}
      <SVGFOLDFaces {graph} />
    {/if}
  {/if}
</SVGCanvas>
