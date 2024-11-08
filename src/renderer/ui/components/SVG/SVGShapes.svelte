<script lang="ts">
  import type { SVGAttributes } from "svelte/elements";
  import { shapeToElement, type Shape } from "../../../geometry/shapes.ts";

  type PropsType = {
    shapes: Shape[] | undefined;
  };

  const { shapes, ...props }: PropsType & SVGAttributes<SVGGElement> = $props();

  let g: SVGGElement;

  const svgElements = $derived(
    (shapes || []).map(shapeToElement).filter((a) => a !== undefined),
  );

  const remove = (el: Element): void => {
    while (el.children.length) {
      el.removeChild(el.children[0]);
    }
  };

  $effect(() => {
    remove(g);
    svgElements.forEach((el) => g.appendChild(el));
  });
</script>

<g bind:this={g} {...props} />
