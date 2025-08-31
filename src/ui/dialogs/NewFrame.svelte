<script lang="ts">
  import { fish, frog, bird, squareFish, windmill } from "rabbit-ear/fold/bases.js";
  import { square, rectangle, polygon } from "rabbit-ear/fold/primitives.js";
  import Dialog from "./Dialog.svelte";
  import { populate } from "rabbit-ear/graph/populate.js";
  // import base2 from "../../assets/base2.fold?raw";
  // import SVGFOLDCanvas from "../SVGCanvas/SVGFOLDCanvas.svelte";
  // import { executeCommand } from "../../kernel/execute.js";
  // import { VerticalUp, DialogNewFrame } from "../../stores/App.js";
  // import { Frames } from "../../stores/Model.js";
  // import { CreasePattern } from "../../stores/ModelCP.js";
  import { AppendFrameCommand } from "../../commands/AppendFrameCommand.ts";
  import context from "../../app/context.svelte.ts";
  import type { FOLD } from "rabbit-ear/types.js";

  let dialog: HTMLDialogElement | undefined = $state();
  let panel = $state("");
  let squareSize = $state(16);
  let rectangleWidth: number | string = $state(2);
  let rectangleHeight: number | string = $state(1);
  let polygonSides = $state(6);

  const rightHanded = $derived(context.ui.settings.rightHanded);

  const canDuplicate = false;
  // const canDuplicate = $derived(
  //   (context.fileManager.document?.data.frames.length ?? 0) > 0,
  // );

  const graphSquare = square();
  const graphRectangle = $derived(
    rectangle(
      ...[rectangleWidth, rectangleHeight]
        .map(parseFloat)
        .map((n) => (isNaN(n) || !isFinite(n) ? 0 : n)),
    ),
  );
  const graphPolygon = $derived(polygon(polygonSides));

  // const graphCurrentFrame = $CreasePattern ? $CreasePattern : {};
  const graphCurrentFrame = $state({});

  const chooseFOLD = (fold: FOLD): void => {
    const doc = context.fileManager.document;
    if (!doc) {
      return;
    }
    doc.executeCommand(new AppendFrameCommand(doc, fold));
    panel = "";
    dialog?.close();
  };

  const duplicate = (): void => {
    // executeCommand("duplicateActiveFrame");
    panel = "";
    dialog?.close();
  };

  const patternsRow1: { graph: FOLD; name: string; onclick: () => void }[] = $derived([
    { graph: {}, name: "empty", onclick: () => chooseFOLD({}) },
    { graph: graphSquare, name: "square", onclick: () => chooseFOLD(square()) },
    { graph: graphSquare, name: "NxN square...", onclick: () => (panel = "nxnSquare") },
    { graph: graphRectangle, name: "rectangle...", onclick: () => (panel = "rectangle") },
    {
      graph: graphPolygon,
      name: "regular polygon...",
      onclick: () => (panel = "polygon"),
    },
  ]);

  const patternsRow2: { graph: FOLD; name: string; onclick: () => void }[] = [
    [fish(), "fish"],
    [bird(), "bird"],
    [squareFish(), "square fish"],
    [frog(), "frog"],
    [windmill(), "windmill"],
    // [populate(JSON.parse(base2)),
  ].map(([graph, name]) => ({ graph, name, onclick: () => chooseFOLD(graph) }));

  const subpanelConfirm = (): void => {
    switch (panel) {
      case "nxnSquare":
        return chooseFOLD(square(squareSize));
      case "rectangle":
        return chooseFOLD(
          rectangle(
            ...[rectangleWidth, rectangleHeight]
              .map(parseFloat)
              .map((n) => (isNaN(n) ? 0 : n)),
          ),
        );
      case "polygon":
        return chooseFOLD(polygon(polygonSides));
      default:
        break;
    }
  };

  const subpanelCancel = (): void => {
    panel = "";
    dialog?.close();
  };

  $effect(() => {
    context.ui.dialogManager.dialogNewFrame = dialog;
  });
</script>

{#snippet CPButton(graph: FOLD, onclick: () => void, name?: string)}
  <div class="flex-column">
    <button class="svg-button crease-pattern" {onclick}>
      <!-- <SVGFOLDCanvas {graph} {rightHanded} /> -->
    </button>
    {#if name}
      <p>{name}</p>
    {/if}
  </div>
{/snippet}

<Dialog bind:dialog>
  <h1>New Frame</h1>
  <div>
    {#if canDuplicate}
      <div class="flex-row gap">
        {@render CPButton(graphCurrentFrame, duplicate, "duplicate current frame")}
      </div>
    {/if}

    <div class="flex-row gap">
      {#each patternsRow1 as pattern}
        {@render CPButton(pattern.graph, pattern.onclick, pattern.name)}
      {/each}
    </div>

    <div class="flex-row gap">
      {#each patternsRow2 as pattern}
        {@render CPButton(pattern.graph, pattern.onclick, pattern.name)}
      {/each}
    </div>

    {#if panel !== ""}
      <div class="panel">
        <hr />
        {#if panel === "nxnSquare"}
          <div class="flex-row">
            <input
              type="number"
              placeholder="side length"
              id="square-size"
              bind:value={squareSize} />
            <label for="square-size">side length</label>
          </div>
        {/if}
        {#if panel === "rectangle"}
          <div class="flex-row">
            <input
              type="text"
              placeholder="width"
              id="rect-width"
              bind:value={rectangleWidth} />
            <input
              type="text"
              placeholder="height"
              id="rect-height"
              bind:value={rectangleHeight} />
            <label for="rect-width">width, </label>
            <label for="rect-height">height</label>
          </div>
        {/if}
        {#if panel === "polygon"}
          <div class="flex-row">
            <input
              type="number"
              placeholder="number of sides"
              id="poly-sides"
              bind:value={polygonSides} />
            <label for="poly-sides">number of sides</label>
          </div>
        {/if}
      </div>
    {/if}

    <div class="flex-row gap margin-top">
      <button class="text-button" onclick={subpanelCancel}>Cancel</button>
      {#if panel !== ""}
        <button class="text-button" onclick={subpanelConfirm}>Confirm</button>
      {/if}
    </div>
  </div>
</Dialog>

<style>
  h1 {
    text-align: center;
    font-size: 1.5rem;
    margin: 1.5rem;
  }
  .flex-column {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .gap {
    gap: 0.333rem;
  }
  .margin-top {
    margin-top: 1rem;
  }
  button.svg-button {
    padding: 0.5rem;
    background-color: var(--background-1);
    width: 6rem;
    height: 6rem;
    border: 1px solid var(--dim);
    border-radius: 0.5rem;
  }
  button.svg-button:hover {
    border-color: var(--highlight);
  }
  button.text-button {
    background-color: var(--uiblue);
    color: var(--text);
    font-size: 1rem;
    padding: 0.5rem 1rem;
    border: 0;
    border-radius: 0.5rem;
  }
  input[type="number"],
  input[type="text"] {
    width: 5rem;
  }
  p {
    margin: 1rem 0;
  }
  .panel {
    margin: 1rem 0;
  }
  .svg-button :global(polygon) {
    fill: var(--background-3);
  }
</style>
