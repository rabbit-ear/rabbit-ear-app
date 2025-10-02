import type { Embedding } from "./Embedding.ts";
import type { VertexBVHType, EdgeBVHType, FaceBVHType } from "../general/BVHGraph.ts";
import { VertexBVH, EdgeBVH, FaceBVH } from "../general/BVHGraph.ts";

export class Nearest {
  #embedding: Embedding;

  #vertexBVH = $derived.by(() => {
    // const _ = [
    //   this.#data.graphUpdate.reset,
    //   this.#data.graphUpdate.structural,
    //   this.#data.graphUpdate.isomorphic.coords,
    // ];
    const _ = [
      this.#embedding.embeddingUpdate.reset,
      this.#embedding.embeddingUpdate.structural,
      this.#embedding.embeddingUpdate.isomorphic.coords,
    ];
    return VertexBVH(this.#embedding.graph ?? {});
  });

  #edgeBVH = $derived.by(() => {
    const _ = [
      this.#embedding.embeddingUpdate.reset,
      this.#embedding.embeddingUpdate.structural,
      this.#embedding.embeddingUpdate.isomorphic.coords,
    ];
    return EdgeBVH(this.#embedding.graph ?? {});
  });

  #faceBVH = $derived.by(() => {
    const _ = [
      this.#embedding.embeddingUpdate.reset,
      this.#embedding.embeddingUpdate.structural,
      this.#embedding.embeddingUpdate.isomorphic.coords,
    ];
    return FaceBVH(this.#embedding.graph ?? {});
  });

  constructor(embedding: Embedding) {
    this.#embedding = embedding;
  }

  vertex(point: [number, number]): VertexBVHType {
    return this.#vertexBVH?.nearest(point);
  }

  edge(point: [number, number]): EdgeBVHType {
    return this.#edgeBVH?.nearest(point);
  }

  face(point: [number, number]): FaceBVHType {
    return this.#faceBVH?.nearest(point);
  }
}

