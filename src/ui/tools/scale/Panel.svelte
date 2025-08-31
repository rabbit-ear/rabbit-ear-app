<script lang="ts">
  //import type { Panel } from "../../../panel/panel.ts";
  //import type { GlobalState } from "../GlobalState.svelte.ts";

  //type PropsType = {
  //  panel: Panel;
  //  state: GlobalState;
  //};
  //let { panel, state }: PropsType = $props();
</script>

<div class="column gap">
  <div class="row">
    <input type="text" id="scale-amount" /><label for="scale-amount">amount</label>
  </div>

  <div class="row">
    <p>origin:</p>
    <input type="text" id="origin-x" /><label for="origin-x">x</label>
    <input type="text" id="origin-y" /><label for="origin-y">y</label>
  </div>

  <div class="row">
    <button>scale</button>
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
