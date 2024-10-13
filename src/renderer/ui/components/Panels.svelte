<script lang="ts">
  import type { Panel } from "../panel/panel.ts";
  import Wrapper from "../panel/Wrapper.svelte";
  import app from "../../app/App.svelte.ts";
  const panels: Panel[] = $derived(app.ui?.panels || []);

  // hardcode debug panel for now
  import DebugPanel from "../panel/DebugPanel.svelte";
  class Debug implements Panel {
    title = "Debug";
    component = DebugPanel;
  }
  const debugPanel = new Debug();
</script>

<div class="column gap">
  <!-- debug panel temp hardcoded -->
  <Wrapper panel={debugPanel}>
    <DebugPanel />
  </Wrapper>
  {#each panels as panel}
    <Wrapper {panel}>
      <panel.component {panel} />
    </Wrapper>
  {/each}
</div>

<style>
  div {
    width: 100%;
    height: 100%;
  }

  .column {
    display: flex;
    flex-direction: column;
  }

  .gap {
    gap: 3px;
  }
</style>
