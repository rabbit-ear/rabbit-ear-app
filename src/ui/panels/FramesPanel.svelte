<script lang="ts">
  import type { FOLD, FOLDChildFrame, FOLDFileMetadata } from "rabbit-ear/types.js";
  import type { FrameAttributes } from "../../graphs/FrameAttributes.ts";
  import context from "../../app/context.svelte.ts";
  // import Rendering from "./Rendering.svelte";

  const classNames: { [key: string]: string } = {
    creasePattern: "crease pattern",
    foldedForm: "folded form",
  };

  let frames: FOLD[] = $derived(context.fileManager.document?.data.frames ?? []);

  let frameIndex = $derived(context.fileManager.document?.data.frameIndex);

  let framesStyle = $derived(
    frames
      .map((graph) => graph?.frame_classes || [])
      .map((classes) => classes.map((cl) => classNames[cl]))
      .map((classes) => classes.filter((a) => a).join(" ")),
  );

  let frameStyles = $derived(context.fileManager.document?.data.framesStyle);

  const makeNewFrame = (): void => context.ui.dialogManager.dialogNewFrame?.showModal();

  const onclick = (index: number): void => {
    if (!context.fileManager.document) {
      return;
    }
    context.fileManager.document.data.frameIndex = index;
  };
</script>

<div class="column gap-sm scrollable">
  {#each frames as graph, i}
    {#if i !== 0}
      <hr />
    {/if}
    <button onclick={(): void => onclick(i)} class="row frame gap-lg">
      <p>{frameIndex === i ? "●" : "○"}</p>
      <!-- <Rendering {graph} frameStyle={frameStyles[i]} /> -->
      {#if frameIndex === i}
        <p class="strong">{framesStyle[i]}</p>
      {:else}
        <p>{framesStyle[i]}</p>
      {/if}
    </button>
  {/each}
  <hr />
  <!-- the new frame button -->
  <button onclick={makeNewFrame} class="row frame gap-lg">
    <p class="dim">+</p>
    <p class="dim">new frame</p>
  </button>
</div>

<style>
  hr {
    flex: 1 0 auto;
  }

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

  .dim {
    color: var(--dim);
  }

  button:hover .dim {
    color: var(--text);
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
    overflow-x: hidden;
    overflow-y: auto;
  }

  .frame {
    flex: 1 0 auto;
    height: 1.25rem;
    align-items: center;
    justify-content: start;
    padding: 0.25rem;
  }

  .frame :global(svg) {
    width: initial;
  }
</style>
