import type { Component } from "svelte";
import type { FOLD } from "rabbit-ear/types.d.ts";
import type { Embedding } from "../Embedding.ts";
import type { FrameAttributes } from "../FrameAttributes.ts";
import type { GraphData } from "../GraphData.svelte.ts";
// import type { Shape } from "../../geometry/shapes.ts";
import Panel from "./Panel.svelte";
import { resize2 } from "rabbit-ear/math/vector.js";
import type { FOLDSelection } from "../../general/types.ts";
import { VertexBVH, EdgeBVH, FaceBVH } from "../../general/BVHGraph.ts";

export class CreasePattern implements Embedding {
  name: string = "creasePattern";
  abbreviation: string = "cp";
  errors: string[] = [];
  panel: Component = Panel;
  #data: GraphData;

  vertexBVH = $derived.by(() => VertexBVH(this.#data.frame));
  edgeBVH = $derived.by(() => EdgeBVH(this.#data.frame));
  faceBVH = $derived.by(() => FaceBVH(this.#data.frame));

  nearestVertex(point: [number, number]): object {
    return this.vertexBVH?.nearest(point);
  }

  nearestEdge(point: [number, number]): object {
    return this.edgeBVH?.nearest(point);
  }

  nearestFace(point: [number, number]): object {
    return this.faceBVH?.nearest(point);
  }

  // nearestVertex: any = $derived.by(() => {
  //   try {
  //     return this.vertexBVH?.nearest([0.25, 0.25]);
  //   } catch (err) {
  //     console.log(err);
  //     return undefined;
  //   }
  // });
  //
  // nearestEdge: any = $derived.by(() => {
  //   try {
  //     return this.edgeBVH?.nearest([0.25, 0.25]);
  //   } catch (err) {
  //     console.log(err);
  //     return undefined;
  //   }
  // });
  //
  // nearestFace: any = $derived.by(() => {
  //   try {
  //     return this.faceBVH?.nearest([0.25, 0.25]);
  //   } catch (err) {
  //     console.log(err);
  //     return undefined;
  //   }
  // });

  // it might be possible to "unfold" the vertices
  get graph(): FOLD | undefined {
    return this.#data.frameAttributes?.isFoldedForm ? undefined : this.#data.frame as FOLD;
  }

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

  // #makeBVHEffect(): () => void {
  //   return $effect.root(() => {
  //     $effect(() => {
  //       this.bvh = new MixedBVH2D(this.graph ?? {});
  //     });
  //     return () => { };
  //   });
  // }

  // get shapes(): Shape[] {
  //   return this.#model.shapes;
  // }

  // #effects: (() => void)[] = [];
  selection?: FOLDSelection;

  constructor(data: GraphData) {
    this.#data = data;
    // this.#effects = [this.#makeBVHEffect()];
  }

  // dealloc() {
  //   this.#effects.forEach(fn => fn());
  // }
}
