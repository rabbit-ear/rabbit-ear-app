<script lang="ts">
  import { getCurrentWindow } from "@tauri-apps/api/window";
  import context from "../../app/context.svelte.ts";

  /**
   * @description update the system app title name to include the file name
   * and the asterisk indicator if the file has unsaved changes; but only
   * send an update if the desired and the current titles differ.
   */
  $effect(() => {
    getCurrentWindow().setTitle(context.appTitle);
  });
</script>
