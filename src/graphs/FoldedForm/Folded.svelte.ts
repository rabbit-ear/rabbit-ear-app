import { makeVerticesCoordsFolded } from "rabbit-ear/graph/vertices/folded.js";
import type { GraphData } from "../GraphData.svelte";
import { FrameClass } from "../FrameAttributes";
import type { FOLD } from "rabbit-ear/types.js";

export class Folded {
  #data: GraphData;

  foldedVerticesAndError: {
    error: Error | undefined;
    result: [number, number][] | [number, number, number][];
  } = $derived.by(() => {
    try {
      console.log("querying folded vertices");
      return this.#data.frame.attributes.class === FrameClass.foldedForm
        ? { error: undefined, result: this.#data.frame.baked.vertices_coords ?? [] }
        : { error: undefined, result: makeVerticesCoordsFolded(this.#data.frame.baked) };
    } catch (err: unknown) {
      const error = err instanceof Error
        ? err
        : new Error(String(err));
      return { error, result: [] };
    }
  });

  vertices_coords: [number, number][] | [number, number, number][] = $derived(
    this.foldedVerticesAndError.result
  );

  graph: FOLD = $derived.by(() => ({
    ...this.#data.frame.baked,
    vertices_coords: this.vertices_coords,
  }));

  error: Error | undefined = $derived(this.foldedVerticesAndError.error);

  constructor(data: GraphData) {
    this.#data = data;
  }
}

