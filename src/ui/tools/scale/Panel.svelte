<script lang="ts">
  import { AffineScaleCommand } from "../../../commands/AffineScaleCommand.ts";
  import context from "../../../app/context.svelte.ts";

  const scaleTool = $derived(
    // context.ui.toolManager.tool?.constructor === ScaleTool
    context.ui.toolManager.toolName === "ui.tools.scale"
      ? context.ui.toolManager.tool
      : undefined,
  );
  const globalState = $derived(scaleTool?.state);

  $effect(() => {
    console.log(
      "TOOL INFO (in panel)",
      scaleTool,
      globalState,
      context.ui.toolManager.tool,
    );
  });

  let scaleAmount: number = $state(1.0);

  const doScale = () => {
    const doc = context.fileManager.document;
    const scale = Number(scaleAmount);
    const origin = globalState.toolOrigin.map(parseFloat);
    if (doc && !isNaN(scale) && isFinite(scale)) {
      const command = new AffineScaleCommand(doc, scale, origin);
      doc.executeCommand(command);
    }
  };
</script>

<div class="column gap">
  <div class="row">
    <label for="scale-amount">amount:</label><input
      type="text"
      id="scale-amount"
      bind:value={scaleAmount} />
  </div>

  {#if globalState}
    <div class="row">
      <p>origin:</p>
      <input type="text" id="origin-x" bind:value={globalState.toolOrigin[0]} />
      <p>,</p>
      <input type="text" id="origin-y" bind:value={globalState.toolOrigin[1]} />
      <p>,</p>
      <input type="text" id="origin-z" bind:value={globalState.toolOrigin[2]} />
    </div>
  {/if}

  <div class="row">
    <button onclick={doScale}>scale</button>
  </div>
  <!--
  <input type="checkbox" id="checkbox-snap" bind:checked={state.smartSnap} /><label
    for="checkbox-snap">snap</label>
  -->
</div>

<style>
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
  input[type="text"] {
    flex: 1 1 auto;
    width: 100%;
  }
  label {
    flex: 0 1 auto;
    /* width: 100%; */
  }
</style>
