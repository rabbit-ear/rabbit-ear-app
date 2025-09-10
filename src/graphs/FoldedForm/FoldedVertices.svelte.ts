import { makeVerticesCoordsFolded } from "rabbit-ear/graph/vertices/folded.js";
import type { GraphData } from "../GraphData.svelte";
import { FrameClass } from "../FrameAttributes";
import type { FOLD } from "rabbit-ear/types.js";
import type { FoldedForm } from "./FoldedForm.svelte.ts";

export class FoldedVertices {
  #foldedForm: FoldedForm;
  #data: GraphData;

  foldedVerticesAndError: {
    error: Error | undefined;
    result: [number, number][] | [number, number, number][] | undefined;
  } = $derived.by(() => {
    try {
      // console.log("querying folded vertices");
      return this.#foldedForm.attributes.class === FrameClass.foldedForm
        // ? { error: undefined, result: this.#data.frame.graph.vertices_coords ?? [] }
        ? { error: undefined, result: undefined }
        : { error: undefined, result: makeVerticesCoordsFolded(this.#data.frame.graph) };
    } catch (err: unknown) {
      const error = err instanceof Error
        ? err
        : new Error(String(err));
      return { error, result: undefined };
    }
  });

  vertices_coords: [number, number][] | [number, number, number][] | undefined = $derived(
    this.foldedVerticesAndError.result
  );

  graph: FOLD = $derived.by(() => ({
    ...this.#data.frame.graph,
    vertices_coords: this.vertices_coords,
  }));

  error: Error | undefined = $derived(this.foldedVerticesAndError.error);

  constructor(foldedForm: FoldedForm, data: GraphData) {
    this.#foldedForm = foldedForm;
    this.#data = data;
  }
}

