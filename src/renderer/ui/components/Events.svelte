<script lang="ts">
  import { onkeydown, onkeyup } from "../../app/keyboardEvents.svelte";
</script>

<svelte:window {onkeyup} {onkeydown} />
