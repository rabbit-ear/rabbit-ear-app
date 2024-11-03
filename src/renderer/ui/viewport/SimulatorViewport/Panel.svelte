<script lang="ts">
  import Settings from "./ClassSettings.svelte.ts";
</script>

<div class="column gap">
  <div class="row gap">
    <p>simulator active</p>
    <input type="checkbox" bind:checked={Settings.active} />
  </div>

  <div class="row gap">
    <p>fold amount</p>
    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      disabled={!Settings.active}
      bind:value={Settings.foldAmount} />
  </div>

  <div class="row gap">
    <p>pointer tool</p>
    <div class="toggle-row">
      <button
        class={Settings.tool === "trackball" ? "highlighted" : ""}
        onclick={(): void => {
          Settings.tool = "trackball";
        }}>trackball</button>
      <button
        class={Settings.tool === "pull" ? "highlighted" : ""}
        onclick={(): void => {
          Settings.tool = "pull";
        }}>pull</button>
    </div>
  </div>

  <div class="row gap">
    <button disabled={!Settings.active} onclick={Settings.reset}>reset model</button>
  </div>

  <hr />

  <div class="row gap">
    <p>
      error
      <input
        type="text"
        class="long"
        disabled={!Settings.active}
        bind:value={Settings.error} />
    </p>
  </div>

  <div class="row gap">
    <p>integration</p>
    <div class="toggle-row">
      <button
        class={Settings.integration === "euler" ? "highlighted" : ""}
        onclick={(): void => {
          Settings.integration = "euler";
        }}>euler</button>
      <button
        class={Settings.integration === "verlet" ? "highlighted" : ""}
        onclick={(): void => {
          Settings.integration = "verlet";
        }}>verlet</button>
    </div>
  </div>

  <div class="row gap">
    <p>axial stiffness</p>
    <input type="text" class="short" bind:value={Settings.axialStiffness} />
    <input
      type="range"
      min="10"
      max="100"
      step="1"
      bind:value={Settings.axialStiffness} />
  </div>

  <div class="row gap">
    <p>face stiffness</p>
    <input type="text" class="short" bind:value={Settings.faceStiffness} />
    <input type="range" min="0" max="5" step="0.02" bind:value={Settings.faceStiffness} />
  </div>

  <div class="row gap">
    <p>join stiffness</p>
    <input type="text" class="short" bind:value={Settings.joinStiffness} />
    <input type="range" min="0" max="3" step="0.01" bind:value={Settings.joinStiffness} />
  </div>

  <div class="row gap">
    <p>
      crease stiffness
      <input type="text" class="short" bind:value={Settings.creaseStiffness} />
    </p>
    <input
      type="range"
      min="0"
      max="3"
      step="0.01"
      bind:value={Settings.creaseStiffness} />
  </div>

  <div class="row gap">
    <p>
      damping ratio
      <input type="text" class="short" bind:value={Settings.dampingRatio} />
    </p>
    <input
      type="range"
      min="0.01"
      max="0.5"
      step="0.01"
      bind:value={Settings.dampingRatio} />
  </div>
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
