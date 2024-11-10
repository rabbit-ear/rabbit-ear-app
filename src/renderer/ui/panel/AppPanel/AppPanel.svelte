<script lang="ts">
  import app from "../../../app/App.svelte.ts";
  import Settings from "../../../app/Settings.svelte.ts";

  //let showScriptView: boolean = $state(false);
  //$effect(() => app.ui?.showScriptViewport(showScriptView));
</script>

<div class="column gap">
  <div class="row gap">
    <input type="checkbox" id="right-handed" bind:checked={Settings.rightHanded} />
    <label for="right-handed">right handed</label>
  </div>
  <div class="row gap">
    <p>View</p>
    <button onclick={(): void => app.ui?.viewports.add()}>+</button>
    <button onclick={(): void => app.ui?.viewports.remove()}>-</button>
  </div>
  <div class="row gap">
    <button onclick={(): void => app.ui?.viewports.addScriptViewport()}
      >Script Editor</button>
  </div>
  <!--
  <div class="row gap">
    <input type="checkbox" id="checkbox-script-view" bind:checked={showScriptView} />
    <label for="checkbox-script-view">Script Editor</label>
  </div>
  -->
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
