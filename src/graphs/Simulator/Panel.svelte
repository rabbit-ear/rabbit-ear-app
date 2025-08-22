<script lang="ts">
  import context from "../../app/context.svelte.ts";

  let showMore = $state(false);
  const settingsDidPress = (): void => {
    showMore = !showMore;
  };
</script>

<div class="column gap">
  <div class="row gap">
    <p>simulator active</p>
    <input type="checkbox" bind:checked={context.simulator.active} />
  </div>

  <div class="row gap">
    <p>fold amount</p>
    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      disabled={!context.simulator.active}
      bind:value={context.simulator.foldAmount} />
  </div>

  <div class="row gap">
    <p>pointer tool</p>
    <div class="toggle-row">
      <button
        class={context.simulator.tool === "trackball" ? "highlighted" : ""}
        onclick={(): void => {
          context.simulator.tool = "trackball";
        }}>trackball</button>
      <button
        class={context.simulator.tool === "pull" ? "highlighted" : ""}
        onclick={(): void => {
          context.simulator.tool = "pull";
        }}>pull</button>
    </div>
  </div>

  <div class="row gap">
    <button disabled={!context.simulator.active} onclick={context.simulator.reset}
      >reset model</button>
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
          disabled={!context.simulator.active}
          bind:value={context.simulator.error} />
      </p>
    </div>

    <div class="row gap">
      <p>integration</p>
      <div class="toggle-row">
        <button
          class={context.simulator.integration === "euler" ? "highlighted" : ""}
          onclick={(): void => {
            context.simulator.integration = "euler";
          }}>euler</button>
        <button
          class={context.simulator.integration === "verlet" ? "highlighted" : ""}
          onclick={(): void => {
            context.simulator.integration = "verlet";
          }}>verlet</button>
      </div>
    </div>

    <div class="row gap">
      <p>axial stiffness</p>
      <input type="text" class="short" bind:value={context.simulator.axialStiffness} />
      <input
        type="range"
        min="10"
        max="100"
        step="1"
        bind:value={context.simulator.axialStiffness} />
    </div>

    <div class="row gap">
      <p>face stiffness</p>
      <input type="text" class="short" bind:value={context.simulator.faceStiffness} />
      <input
        type="range"
        min="0"
        max="5"
        step="0.02"
        bind:value={context.simulator.faceStiffness} />
    </div>

    <div class="row gap">
      <p>join stiffness</p>
      <input type="text" class="short" bind:value={context.simulator.joinStiffness} />
      <input
        type="range"
        min="0"
        max="3"
        step="0.01"
        bind:value={context.simulator.joinStiffness} />
    </div>

    <div class="row gap">
      <p>
        crease stiffness
        <input type="text" class="short" bind:value={context.simulator.creaseStiffness} />
      </p>
      <input
        type="range"
        min="0"
        max="3"
        step="0.01"
        bind:value={context.simulator.creaseStiffness} />
    </div>

    <div class="row gap">
      <p>
        damping ratio
        <input type="text" class="short" bind:value={context.simulator.dampingRatio} />
      </p>
      <input
        type="range"
        min="0.01"
        max="0.5"
        step="0.01"
        bind:value={context.simulator.dampingRatio} />
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
