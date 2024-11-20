<script lang="ts">
  import app from "../../../app/App.svelte.ts";
  import Rendering from "./Rendering.svelte";

  const classNames = { creasePattern: "crease pattern", foldedForm: "folded form" };

  let framesFlat = $derived(app.models.framesFlat);
  let activeFrame = $derived(app.models.activeFrame);
  let framesStyle = $derived(
    framesFlat
      .map((graph) => graph?.frame_classes || [])
      .map((classes) => classes.map((cl) => classNames[cl]))
      .map((classes) => classes.filter((a) => a).join(" ")),
  );
  let frameStyles = $derived(app.models.framesStyle);

  const onclick = (index: number): void => {
    app.models.activeFrame = index;
  };
</script>

<div class="column gap-sm scrollable">
  {#each framesFlat as graph, i}
    {#if i !== 0}
      <hr />
    {/if}
    <button onclick={(): void => onclick(i)} class="row frame gap-lg">
      <p>{activeFrame === i ? "●" : "○"}</p>
      <Rendering {graph} frameStyle={frameStyles[i]} />
      {#if activeFrame === i}
        <p class="strong">{framesStyle[i]}</p>
      {:else}
        <p>{framesStyle[i]}</p>
      {/if}
    </button>
  {/each}
</div>

<style>
  button {
    all: unset;
    cursor: pointer;
  }
  button:hover {
    background-color: var(--background-3);
  }
  p {
    pointer-events: none;
  }
  .strong {
    font-weight: bold;
  }

  .gap-sm {
    gap: 2px;
  }
  .gap-lg {
    gap: var(--form-gap);
  }

  .column {
    display: flex;
    flex-direction: column;
  }

  .row {
    display: flex;
    flex-direction: row;
  }

  .scrollable {
    max-height: 12rem;
    overflow-y: scroll;
  }

  .frame {
    height: 2rem;
    align-items: center;
    justify-content: start;
    padding: 0.25rem;
  }

  .frame :global(svg) {
    width: initial;
  }
</style>
