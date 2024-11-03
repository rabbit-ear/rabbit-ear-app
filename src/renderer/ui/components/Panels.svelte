<script lang="ts">
  import type { Component } from "svelte";
  import Wrapper from "../panel/Wrapper.svelte";
  import app from "../../app/App.svelte.ts";
  const panels: Component[] = $derived(app.ui?.panels || []);
  const panelsName: string[] = $derived(app.ui?.panelsName || []);
</script>

<div class="column">
  {#each panels as PanelComponent, i}
    <Wrapper title={panelsName[i]}>
      <PanelComponent />
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
  }

  /*gap is accomplished by each Wrapper's margin, this also gives margin at the top*/
  /*.gap {*/
  /*  gap: var(--form-gap);*/
  /*}*/
</style>
