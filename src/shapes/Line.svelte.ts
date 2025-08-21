import { subtract2 } from "rabbit-ear/math/vector.js";
import { boundingBox } from "rabbit-ear/math/polygon.js";
import type { Box } from "rabbit-ear/types.js";
import type { Shape } from "./Shape.ts";
import type { Point } from "./Point.svelte.ts";

export class Line implements Shape {
  p: Point = $state() as unknown as Point;
  q: Point = $state() as unknown as Point;

  origin: [number, number] | undefined = $derived(this.p.coords);
  vector: [number, number] | undefined = $derived(this.q.coords && this.p.coords
    ? subtract2(this.q.coords, this.p.coords)
    : undefined);

  // dependencies: Shape[] = $state([]);
  // dependents: Shape[] = $state([]);
  defined: boolean = $derived(this.origin !== undefined && this.vector !== undefined);

  makeBounds(padding: number): Box | undefined {
    return this.defined && this.q.coords && this.p.coords
      ? boundingBox([this.p.coords, this.q.coords], padding)
      : undefined;
  }

  // compute(): void { }

  constructor(p: Point, q: Point) {
    this.p = p;
    this.q = q;
    // this.dependencies = [p, q];
  }
}

