<script lang="ts">
  import type { FOLD } from "rabbit-ear/types.js";

  type PropsType = {
    graph?: FOLD;
  };

  const { graph = {} }: PropsType = $props();

  const makeFacesCoords = (g: FOLD): ([number, number] | [number, number, number])[][] =>
    (g.faces_vertices || []).map((fv) => fv.map((v) => g.vertices_coords[v]));

  const faces_vertices = $derived(graph.faces_vertices || []);

  const faces = $derived(
    makeFacesCoords(graph)
      .map((points) => points.map(([x, y]) => [x, y]))
      .map((points) => points.map((point) => point.map((n) => n.toFixed(4))))
      .map((points) => points.map((point) => point.join(",")).join(" ")),
  );

  const classes: string[] = $derived(faces_vertices.map(() => "front"));
</script>

{#each faces as points, i}
  <polygon {points} class={classes[i]} />
{/each}

<style>
  polygon {
    stroke: none;
    fill: #fff1;
  }
</style>
