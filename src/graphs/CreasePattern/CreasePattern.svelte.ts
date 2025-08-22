import { untrack, type Component } from "svelte";
import type { FOLD } from "rabbit-ear/types.d.ts";
import type { Embedding } from "../Embedding.ts";
import type { FrameAttributes } from "../FrameAttributes.ts";
import type { GraphData } from "../GraphData.svelte.ts";
// import type { Shape } from "../../geometry/shapes.ts";
import Panel from "./Panel.svelte";
import { resize2 } from "rabbit-ear/math/vector.js";
import type { FOLDSelection } from "../../general/types.ts";
import type { VertexBVHType, EdgeBVHType, FaceBVHType } from "../../general/BVHGraph.ts";
import { VertexBVH, EdgeBVH, FaceBVH } from "../../general/BVHGraph.ts";
import type { GraphUpdateEvent } from "../Updated.ts";

export class CreasePattern implements Embedding {
  name: string = "creasePattern";
  abbreviation: string = "cp";
  errors: string[] = [];
  panel: Component = Panel;
  #data: GraphData;
  #effects: (() => void)[];

  vertexBVH = $derived.by(() => VertexBVH(this.#data.frame));
  edgeBVH = $derived.by(() => EdgeBVH(this.#data.frame));
  faceBVH = $derived.by(() => FaceBVH(this.#data.frame));

  nearestVertex(point: [number, number]): VertexBVHType {
    return this.vertexBVH?.nearest(point);
  }

  nearestEdge(point: [number, number]): EdgeBVHType {
    return this.edgeBVH?.nearest(point);
  }

  nearestFace(point: [number, number]): FaceBVHType {
    return this.faceBVH?.nearest(point);
  }

  // get graph(): FOLD | undefined {
  //   return this.#data.frameAttributes?.isFoldedForm ? undefined : this.#data.frame as FOLD;
  // }

  graph: FOLD | undefined;

  graphUpdate: GraphUpdateEvent = $state({ isomorphic: false });

  get snapPoints(): [number, number][] {
    return this.graph?.vertices_coords?.map(resize2) ?? [];
  }

  get attributes(): FrameAttributes {
    return {
      isFoldedForm: false,
      dimension: 2,
      isAbstract:
        (this.graph?.vertices_coords &&
          !this.graph?.edges_vertices &&
          !this.graph?.faces_vertices) ?? false,
      // unclear what we should say here. a CP does not render layer orders
      // (not the folded form of a CP, but the CP itself)
      hasLayerOrder: true,
    };
  }

  // get shapes(): Shape[] {
  //   return this.#model.shapes;
  // }

  selection?: FOLDSelection;

  constructor(data: GraphData) {
    this.#data = data;
    this.#effects = [
      this.#effectGraphUpdate(),
    ];
  }

  dealloc() {
    this.#effects.forEach(fn => fn());
  }

  // conditions for updating the graph: 
  // - it always updates (any changes to the source frame)
  #effectGraphUpdate(): () => void {
    return $effect.root(() => {
      $effect(() => {
        const _ = this.#data.frame;
        untrack(() => {
          // it might be possible to "unfold" the vertices
          this.graph = this.#data.frameAttributes?.isFoldedForm
            ? undefined
            : this.#data.frame as FOLD;
          console.log("CP: graph has become", this.graph);
        });
        this.graphUpdate = { isomorphic: false };
        console.log("CP: detecting #data.frame changes, triggering graphUpdate");
      });
      // empty
      return () => { };
    });
  }
}
