<script lang="ts">
  import type { FoldedForm } from "./FoldedForm.svelte.ts";
  import Wrapper from "../Wrapper.svelte";
  import { FrameClass } from "../FrameAttributes.ts";

  const { embedding }: { embedding: FoldedForm } = $props();

  const isFoldedForm = $derived(embedding.attributes.class === FrameClass.foldedForm);

  const errors: string[] = $derived(embedding.errors ?? []);
</script>

<Wrapper title="Folded Form">
  <div class="column gap">
    <div class="row gap">
      {#if isFoldedForm}
        <p>frame is a already folded</p>
      {:else}
        <p>folded state is computed</p>
      {/if}
    </div>
    <div class="row">
      <input
        id="fold-vertices-coords"
        type="checkbox"
        bind:checked={embedding.settings.foldVerticesCoords} />
      <label for="fold-vertices-coords">fold vertices</label>
    </div>
    <div class="row">
      <input
        id="solve-face-orders"
        type="checkbox"
        bind:checked={embedding.settings.solveFaceOrders} />
      <label for="solve-face-orders">solve layer order</label>
    </div>
  </div>
  <div class="row">
    {#each errors as error}
      <span class="error">{error}</span>
    {/each}
  </div>
</Wrapper>

<style>
  div {
    width: 100%;
  }

  .column {
    display: flex;
    flex-direction: column;
  }

  .row {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .gap {
    gap: var(--form-gap);
  }

  .error {
    color: var(--red);
  }

  .warning {
    color: var(--yellow);
  }
</style>
