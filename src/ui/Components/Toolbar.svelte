<script lang="ts">
  import type { Tool } from "../tools/Tool.ts";
  import ToolbarButton from "./ToolbarButton.svelte";
  import t from "../../app/t.ts";

  type ToolConstructor<T extends Tool = Tool> = new () => T;

  interface PropsType {
    tools: { [key: string]: ToolConstructor<Tool> };
    tool: string;
    setTool: (tool: string) => void;
  }

  const { tools, tool, setTool }: PropsType = $props();
</script>

<div class="grid-columns">
  {#each Object.values(tools) as Tool}
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
