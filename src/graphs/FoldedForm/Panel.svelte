<script lang="ts">
  import Wrapper from "../Wrapper.svelte";
  import type { FoldedForm } from "./FoldedForm.svelte.ts";

  const { embedding }: { embedding: FoldedForm } = $props();

  const isFoldedForm = $derived(embedding.sourceIsFoldedForm);
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
        id="folded-form-active"
        type="checkbox"
        bind:checked={embedding.settings.active} />
      <label for="folded-form-active">auto-fold</label>
    </div>
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
</style>
