<script lang="ts">
  import type { Component } from "svelte";
  import Wrapper from "../panel/Wrapper.svelte";
  import app from "../../app/App.svelte.ts";

  const panels: Component[] = $derived(app.ui?.panels.components);
  const props: object[] = $derived(app.ui?.panels.props);
</script>

<div class="column">
  {#each panels as Panel, i}
    <Wrapper title={props?.[i]?.name}>
      <Panel {...props} />
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
