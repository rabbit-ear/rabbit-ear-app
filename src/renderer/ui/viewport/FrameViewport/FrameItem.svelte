<script lang="ts">
  import type { Snippet } from "svelte";

  type PropsType = {
    index: number;
    highlighted: boolean;
    //class: string;
    onclick: (e: MouseEvent) => void;
    onmousedown: (e: MouseEvent) => void;
    onmousemove: (e: MouseEvent) => void;
    onmouseup: (e: MouseEvent) => void;
    onmouseleave: (e: MouseEvent) => void;
    children: Snippet;
  };

  let {
    index = -1,
    highlighted = false,
    //class: className,
    onclick,
    onmousedown,
    onmousemove,
    onmouseup,
    onmouseleave,
    children,
  }: PropsType = $props();
</script>

<!-- important, keep this string encapsulated -->
<!-- it needs to be able to be matched elsewhere in the app -->
<button
  class={["button-frame-item", highlighted ? "highlighted" : ""].join(" ")}
  data-frame-index={index}
  {onclick}
  {onmousedown}
  {onmousemove}
  {onmouseup}
  {onmouseleave}>
  {@render children()}
</button>

<style>
  button {
    all: unset;
    cursor: pointer;
    flex: 0 0 auto;
    width: 5rem;
    height: 5rem;
    /* margin: 0.5rem 0; */
    border: 2px solid transparent;
    border-radius: 4px;
  }

  button:hover {
    border-color: var(--highlight);
  }

  button.highlighted {
    border-color: var(--highlight);
  }

  button:focus {
    outline-offset: -2px;
    outline: 2px solid var(--uiblue);
  }
</style>
