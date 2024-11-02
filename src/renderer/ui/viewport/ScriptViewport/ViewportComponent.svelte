<script lang="ts">
  import type { ScriptViewport } from "./ScriptViewport.svelte.ts";
  //import app from "../../../app/App.svelte.ts";
  //import settings from "./Settings.svelte.ts";
  import CodeMirror from "./CodeMirror.svelte";

  type PropsType = {
    viewport: ScriptViewport;
    rest?: unknown[];
  };

  let { viewport, ...rest }: PropsType = $props();

  //let fontSize = $derived(viewport.view.fontSize);
  //$inspect(fontSize);
</script>

<CodeMirror {...rest} />

<!--
  on:change={changeHandler}></CodeMirror>
-->
