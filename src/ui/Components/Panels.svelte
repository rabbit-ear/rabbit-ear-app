<script lang="ts">
  import type { Component } from "svelte";
  import Wrapper from "../panels/Wrapper.svelte";
  import context from "../../app/context.svelte.ts";

  type PanelType = { name: string; component: Component };

  const panels: PanelType[] = $derived(context.ui.panelManager.panels);
</script>

<div class="panels column">
  {#each panels as panel}
    <Wrapper title={panel.name}>
      <panel.component />
    </Wrapper>
  {/each}
</div>

<style>
  div {
    width: 100%;
    height: 100%;
  }

  .column {
    display: flex;
    flex-direction: column;
    gap: var(--form-gap);
    padding: var(--form-gap);
  }

  .panels :global(p),
  .panels :global(span),
  .panels :global(label),
  .panels :global(ul),
  .panels :global(ol),
  .panels :global(li) {
    font-size: 0.866rem;
  }

  /*gap is accomplished by each Wrapper's margin, this also gives margin at the top*/
  /*.gap {*/
  /*  gap: var(--form-gap);*/
  /*}*/
</style>
