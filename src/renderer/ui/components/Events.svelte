<script lang="ts">
  import { onkeydown, onkeyup } from "../../app/KeyboardEvents.svelte.ts";
</script>

<svelte:window {onkeyup} {onkeydown} />
