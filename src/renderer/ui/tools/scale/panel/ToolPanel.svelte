<script lang="ts">
  //import type { Panel } from "../../../panel/panel.ts";
  //import type { GlobalState } from "../GlobalState.svelte.ts";

  //type PropsType = {
  //  panel: Panel;
  //  state: GlobalState;
  //};
  //let { panel, state }: PropsType = $props();
</script>

<div>
  <input type="text" id="asdf-asdf" /><label for="asdf-asdf">&deg;</label>
  <!--
  <input type="checkbox" id="checkbox-snap" bind:checked={state.smartSnap} /><label
    for="checkbox-snap">snap</label>
-->
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
  }
</style>
