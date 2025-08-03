<script lang="ts">
  import type { Component } from "svelte";
  import Wrapper from "../panels/Wrapper.svelte";
  import context from "../../app/context.svelte.ts";

  type PanelType = { name: string; component: Component };

  const panels: PanelType[] = $derived(context.ui?.panelManager.panels);
</script>

<div class="column">
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
    gap: 0.25rem;
    padding: 0.25rem;
  }

  /*gap is accomplished by each Wrapper's margin, this also gives margin at the top*/
  /*.gap {*/
  /*  gap: var(--form-gap);*/
  /*}*/
</style>
