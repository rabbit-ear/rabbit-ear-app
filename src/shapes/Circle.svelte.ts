import { distance2 } from "rabbit-ear/math/vector.js";
import type { Shape } from "./Shape";

export class Circle {
  p: [number, number];
  q: [number, number];
  origin: [number, number] = $derived.by(() => this.p);
  radius: number = $derived.by(() => distance2(this.q, this.p));

  dependencies: Shape[] = $state([]);

  constructor(p: [number, number], q: [number, number]) {
    this.p = p;
    this.q = q;
    this.dependencies = [p, q];
  }
}
