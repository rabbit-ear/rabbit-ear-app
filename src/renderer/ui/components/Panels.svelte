<script lang="ts">
  import type { Panel } from "../panel/panel.ts";
  import Wrapper from "../panel/Wrapper.svelte";
  import app from "../../app/App.svelte.ts";
  const panels: Panel[] = $derived(app.ui?.panels || []);
</script>

<div class="column gap">
  {#each panels as panel}
    <Wrapper {panel}>
      <panel.component {panel} />
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

  .gap {
    gap: var(--form-gap);
  }
</style>
