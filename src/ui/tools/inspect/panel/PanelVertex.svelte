<script lang="ts">
  import context from "../../../../app/context.svelte.ts";
  import { ModifyVerticesCoordsCommand } from "../../../../commands/ModifyVerticesCoordsCommand.ts";
  const { vertexInfo, graph } = $props();

  const vertex = $derived(vertexInfo?.index);
  const exists = $derived(vertex !== undefined);
  let coords = $state([0, 0]);

  $effect(() => {
    coords = [...(graph?.vertices_coords?.[vertex] ?? [])];
  });

  // const oninput = (index: number, event: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
  const oninput = (index: number, event: InputEvent) => {
    const newCoords = [...(graph?.vertices_coords?.[vertex] ?? [0, 0])];
    newCoords[index] = parseFloat(event.target.value);

    const vertex_coords: [number, number] = newCoords.map((n) =>
      !isNaN(n) && isFinite(n) ? n : 0,
    ) as [number, number];

    console.log("onInput", context.fileManager);
    const newVertexCoords = [];
    newVertexCoords[vertex] = vertex_coords;
    const command = new ModifyVerticesCoordsCommand(
      context.fileManager.document,
      newVertexCoords,
    );
    context.fileManager.document?.executeCommand(command);
  };
</script>

{#if exists}
  <div class="flex-column gap">
    <p class="title">vertex [{vertex}]</p>
    <div class="flex-column">
      {#each coords as value, i}
        <input type="number" {value} oninput={(e) => oninput(i, e)} />
      {/each}
    </div>
  </div>
{/if}

<style>
  .title {
    font-weight: bold;
    color: var(--bright);
  }
</style>
