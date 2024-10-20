<script lang="ts">
  import app from "../../app/App.svelte.ts";
  import Settings from "../../app/Settings.svelte.ts";
</script>

<div class="column gap">
  <div class="row gap">
    <input type="checkbox" id="right-handed" bind:checked={Settings.rightHanded} />
    <label for="right-handed">right handed</label>
  </div>
  <div class="row gap">
    <p>View</p>
    <button onclick={() => app.ui?.addViewport()}>+</button>
    <button onclick={() => app.ui?.removeViewport()}>-</button>
  </div>
</div>

<style>
  .column {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .row {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .gap {
    gap: var(--form-gap);
  }

  button {
    width: 100%;
  }
</style>
