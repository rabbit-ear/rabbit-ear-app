<script lang="ts">
  import type { FoldedFormModel } from "./FoldedFormModel.svelte.ts";

  const { model }: { model: FoldedFormModel } = $props();
</script>

<div class="row">
  <input id="folded-form-active" type="checkbox" bind:checked={model.settings.active} />
  <label for="folded-form-active">auto-fold</label>
</div>

<style>
  .row {
    display: flex;
    flex-direction: row;
  }
</style>
