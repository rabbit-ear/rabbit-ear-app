<script lang="ts">
  import context from "../../../../app/context.svelte.ts";
  import { GlobalState } from "../state/GlobalState.svelte";
  import PanelVertex from "./PanelVertex.svelte";
  import PanelEdge from "./PanelEdge.svelte";
  import PanelFace from "./PanelFace.svelte";

  const graph = $derived(context.fileManager.document?.data.frame);

  const vCount = $derived(graph?.vertices_coords?.length ?? 0);
  const eCount = $derived(graph?.edges_vertices?.length ?? 0);
  const fCount = $derived(graph?.faces_vertices?.length ?? 0);

  const state: GlobalState | undefined = $derived(context.ui.toolManager.tool?.state) as
    | GlobalState
    | undefined;

  const isLocked = $derived(state?.locked !== undefined);

  const vertexInfo = $derived(state?.nearestVertex);
  const edgeInfo = $derived(state?.nearestEdge);
  const faceInfo = $derived(state?.nearestFace);

  const vertex = $derived(state?.nearestVertex?.index);
  const edge = $derived(state?.nearestEdge?.index);
  const face = $derived(state?.nearestFace?.index);
</script>

<div class="column gap">
  {#if isLocked}
    <p class="strong highlight">Locked</p>
  {/if}
  <!-- <div class="row"> -->
  <!--   <p> -->
  <!--     VEF: -->
  <!--     <span class="strong">{vertex}</span> / -->
  <!--     <span class="strong">{edge}</span> / -->
  <!--     <span class="strong">{face}</span> -->
  <!--   </p> -->
  <!-- </div> -->
  <div class="row">
    <p>
      Size:
      <span class="strong">{vCount}</span> /
      <span class="strong">{eCount}</span> /
      <span class="strong">{fCount}</span>
    </p>
  </div>
  <PanelVertex {vertexInfo} {graph} />
  <PanelEdge {edgeInfo} {graph} />
  <PanelFace {faceInfo} {graph} />
</div>

<style>
  .column {
    display: flex;
    flex-direction: column;
  }
  .row {
    display: flex;
    flex-direction: row;
  }
  .strong {
    font-weight: bold;
  }
  .highlight {
    color: var(--highlight);
  }
</style>
