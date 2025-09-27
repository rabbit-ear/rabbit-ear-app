import type { GraphData } from "../GraphData.svelte";
import { makeVerticesCoordsFolded } from "rabbit-ear/graph/vertices/folded.js";
import { FrameClass } from "../FrameAttributes";

export class FoldedVertices {
  #data: GraphData;

  #foldedVerticesAndError: {
    error: Error | undefined;
    result: [number, number][] | [number, number, number][] | undefined;
  } = $derived.by(() => {
    const _ = [
      this.#data.graphUpdate.reset,
      this.#data.graphUpdate.structural,
      this.#data.graphUpdate.isomorphic.coords,
    ];
    try {
      // console.log("querying folded vertices");
      return this.#data.frame.attributes.class === FrameClass.foldedForm
        ? { error: undefined, result: undefined }
        : { error: undefined, result: makeVerticesCoordsFolded(this.#data.frame.graph) };
      // return this.#foldedForm.attributes.class === FrameClass.foldedForm
      //   // ? { error: undefined, result: this.#data.frame.graph.vertices_coords ?? [] }
      //   ? { error: undefined, result: undefined }
      //   : { error: undefined, result: makeVerticesCoordsFolded(this.#data.frame.graph) };
    } catch (err: unknown) {
      const error = err instanceof Error
        ? err
        : new Error(String(err));
      return { error, result: undefined };
    }
  });

  vertices_coords: [number, number][] | [number, number, number][] | undefined = $derived(
    this.#foldedVerticesAndError.result
  );

  error: Error | undefined = $derived(this.#foldedVerticesAndError.error);

  constructor(data: GraphData) {
    this.#data = data;
  }
}

