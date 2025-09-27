<script lang="ts">
  import type { SVGAttributes } from "svelte/elements";
  import type { SVGRendering } from "../SVGRendering.svelte.ts";

  type PropsType = {
    rendering: SVGRendering;
  };

  // $effect(() => {
  //   console.log(
  //     "!!! doing a new rendering",
  //     rendering.vertices.length,
  //     rendering.edges.length,
  //     rendering.faces.length,
  //   );
  // });

  const { rendering, ...props }: PropsType & SVGAttributes<SVGGElement> = $props();
</script>

<g class={rendering.className} {...props}>
  {#if rendering.showFaces}
    <g class="faces">
      {#each rendering.faces as polygon}
        <polygon {...polygon} />
      {/each}
    </g>
  {/if}

  {#if rendering.showEdges}
    <g class="edges">
      {#each rendering.edges as line}
        <line {...line} />
      {/each}
    </g>
  {/if}

  {#if rendering.showVertices}
    <g class="vertices">
      {#each rendering.vertices as circle}
        <circle {...circle} r="var(--circle-radius)" />
      {/each}
    </g>
  {/if}
</g>

<style>
  /* vertices */
  circle {
    fill: var(--dim);
    stroke: none;
  }

  circle.selected {
    fill: var(--yellow);
  }

  /* edges */
  .B,
  .b {
    stroke: darkgray;
  }

  .M,
  .m {
    stroke: crimson;
  }

  .V,
  .v {
    stroke: royalblue;
  }

  .F,
  .f {
    stroke: #555;
  }

  .J,
  .j {
    stroke: gold;
  }

  .C,
  .c {
    stroke: limegreen;
  }

  .U,
  .u {
    stroke: orchid;
  }

  .B.selected,
  .b.selected,
  .M.selected,
  .m.selected,
  .V.selected,
  .v.selected,
  .F.selected,
  .f.selected,
  .J.selected,
  .j.selected,
  .C.selected,
  .c.selected,
  .U.selected,
  .u.selected {
    stroke: var(--yellow);
  }

  /* faces */
  polygon {
    stroke: none;
    fill: #fff1;
  }

  :global(.foldedForm) {
    polygon {
      stroke: none;
      fill: #fff1;
    }
  }

  :global(.creasePattern) {
    polygon {
      stroke: none;
      /*fill: #fff1;*/
      fill: #111;
    }
  }

  polygon.selected,
  :global(.foldedForm) polygon.selected,
  :global(.creasePattern) polygon.selected {
    stroke: none;
    fill: var(--yellow);
    opacity: 0.25;
  }
</style>
