<script lang="ts">
  import type { SimulatorModel } from "../../../model/SimulatorModel.svelte";
  import app from "../../../app/App.svelte";

  // todo: this is counting on Origami Simulator to be a part of the app.
  // if it ever becomes a feature to disable it entirely, this will not exist.
  const settings = $derived(
    (app.fileManager.models.simulator as SimulatorModel).settings,
  );

  let showMore = $state(false);
  const settingsDidPress = (): void => {
    showMore = !showMore;
  };
</script>

<div class="column gap">
  <div class="row gap">
    <p>simulator active</p>
    <input type="checkbox" bind:checked={settings.active} />
  </div>

  <div class="row gap">
    <p>fold amount</p>
    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      disabled={!settings.active}
      bind:value={settings.foldAmount} />
  </div>

  <div class="row gap">
    <p>pointer tool</p>
    <div class="toggle-row">
      <button
        class={settings.tool === "trackball" ? "highlighted" : ""}
        onclick={(): void => {
          settings.tool = "trackball";
        }}>trackball</button>
      <button
        class={settings.tool === "pull" ? "highlighted" : ""}
        onclick={(): void => {
          settings.tool = "pull";
        }}>pull</button>
    </div>
  </div>

  <div class="row gap">
    <button disabled={!settings.active} onclick={settings.reset}>reset model</button>
  </div>

  <div class="row">
    <hr />
    <button onclick={settingsDidPress}>settings</button>
    <hr />
  </div>

  {#if showMore}
    <div class="row gap">
      <p>
        error
        <input
          type="text"
          class="long"
          disabled={!settings.active}
          bind:value={settings.error} />
      </p>
    </div>

    <div class="row gap">
      <p>integration</p>
      <div class="toggle-row">
        <button
          class={settings.integration === "euler" ? "highlighted" : ""}
          onclick={(): void => {
            settings.integration = "euler";
          }}>euler</button>
        <button
          class={settings.integration === "verlet" ? "highlighted" : ""}
          onclick={(): void => {
            settings.integration = "verlet";
          }}>verlet</button>
      </div>
    </div>

    <div class="row gap">
      <p>axial stiffness</p>
      <input type="text" class="short" bind:value={settings.axialStiffness} />
      <input
        type="range"
        min="10"
        max="100"
        step="1"
        bind:value={settings.axialStiffness} />
    </div>

    <div class="row gap">
      <p>face stiffness</p>
      <input type="text" class="short" bind:value={settings.faceStiffness} />
      <input
        type="range"
        min="0"
        max="5"
        step="0.02"
        bind:value={settings.faceStiffness} />
    </div>

    <div class="row gap">
      <p>join stiffness</p>
      <input type="text" class="short" bind:value={settings.joinStiffness} />
      <input
        type="range"
        min="0"
        max="3"
        step="0.01"
        bind:value={settings.joinStiffness} />
    </div>

    <div class="row gap">
      <p>
        crease stiffness
        <input type="text" class="short" bind:value={settings.creaseStiffness} />
      </p>
      <input
        type="range"
        min="0"
        max="3"
        step="0.01"
        bind:value={settings.creaseStiffness} />
    </div>

    <div class="row gap">
      <p>
        damping ratio
        <input type="text" class="short" bind:value={settings.dampingRatio} />
      </p>
      <input
        type="range"
        min="0.01"
        max="0.5"
        step="0.01"
        bind:value={settings.dampingRatio} />
    </div>
  {/if}
</div>

<style>
  button {
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
  .long {
    width: 8rem;
  }
  .short {
    width: 3rem;
  }
</style>
