<script lang="ts">
  import type { FoldedForm } from "./FoldedForm.ts";

  const { embedding }: { embedding: FoldedForm } = $props();
</script>

<div class="column gap">
  <div class="row gap">
    <p>folded form status</p>
  </div>
  <div class="row">
    <input
      id="folded-form-active"
      type="checkbox"
      bind:checked={embedding.settings.active} />
    <label for="folded-form-active">auto-fold</label>
  </div>
</div>

<style>
  .row {
    display: flex;
    flex-direction: row;
  }
</style>
