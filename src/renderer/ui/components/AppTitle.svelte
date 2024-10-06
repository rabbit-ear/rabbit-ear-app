<script lang="ts">
  import { getAppTitle } from "../../app/meta.svelte.ts";

  // cache the current title of the app window
  let previousAppTitle = "";

  /**
   * @description update the system app title name to include the file name
   * and the asterisk indicator if the file has unsaved changes; but only
   * send an update if the desired and the current titles differ.
   */
  $effect(() => {
    if (getAppTitle() === previousAppTitle) {
      return;
    }
    previousAppTitle = getAppTitle();
    window.api.setAppTitle(getAppTitle());
  });
</script>
