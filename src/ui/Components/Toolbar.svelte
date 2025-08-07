<script lang="ts">
  // import type { Viewport } from "../viewports/Viewport.ts";
  import Tools from "../tools/index.ts";
  import ToolbarButton from "./ToolbarButton.svelte";
  import t from "../../app/t.ts";

  interface PropsType {
    tool: string;
    setTool: (tool: string) => void;
  }

  const { tool, setTool }: PropsType = $props();
</script>

<div class="grid-columns">
  {#each Object.values(Tools) as Tool}
    <ToolbarButton
      name={t(Tool.key) ?? Tool.name}
      Icon={Tool.icon}
      onclick={() => setTool(Tool.key)}
      selected={tool === Tool.key} />
  {/each}
</div>

<style>
  .grid-columns {
    display: grid;
    grid-template-columns: 50% 50%;
    align-content: flex-start;
    position: relative;
  }
</style>
