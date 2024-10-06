<script lang="ts">
  import settings from "./Settings.svelte.ts";
</script>

<div class="row">
  <input
    type="radio"
    id="radio-tiling-triangle"
    value="square"
    bind:group={settings.tiling} />
  <input
    type="radio"
    id="radio-tiling-triangle"
    value="triangle"
    bind:group={settings.tiling} />
</div>

<div class="row">
  <input type="checkbox" id="checkbox-show-grid" bind:checked={settings.showGrid} />
  <label for="checkbox-show-grid">show grid</label>
</div>

<div class="row">
  <input type="checkbox" id="checkbox-show-axes" bind:checked={settings.showAxes} />
  <label for="checkbox-show-axes">show axes</label>
</div>
