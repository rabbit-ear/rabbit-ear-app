import { EPSILON } from "rabbit-ear/math/constant.js";
import { add2, distance2, subtract2 } from "rabbit-ear/math/vector.js";
import { boundingBox } from "rabbit-ear/math/polygon.js";
import type { Shape } from "./Shape.ts";
import type { Point } from "./Point.svelte.ts";
import type { Box } from "rabbit-ear/types.js";

export class Circle implements Shape {
  p: Point = $state() as unknown as Point;
  q: Point = $state() as unknown as Point;

  origin: [number, number] | undefined = $derived(this.p.coords);
  radius: number = $derived(this.q.coords && this.p.coords
    ? distance2(this.q.coords, this.p.coords)
    : 0);

  // dependencies: Shape[] = $state([]);
  // dependents: Shape[] = $state([]);
  defined: boolean = $derived(this.origin !== undefined && this.radius > EPSILON);

  makeBounds(padding: number): Box | undefined {
    return this.defined && this.origin
      ? boundingBox([
        subtract2(this.origin, [this.radius, this.radius]),
        add2(this.origin, [this.radius, this.radius]),
      ], padding)
      : undefined;
  }

  // compute(): void { }

  constructor(p: Point, q: Point) {
    this.p = p;
    this.q = q;
    // this.dependencies = [p, q];
  }
}

