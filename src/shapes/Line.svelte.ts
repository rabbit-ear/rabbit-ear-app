import { subtract2 } from "rabbit-ear/math/vector.js";
import type { Shape } from "./Shape";

export class Line {
  p: [number, number];
  q: [number, number];
  origin: [number, number] = $derived.by(() => this.p);
  vector: [number, number] = $derived.by(() => subtract2(this.q, this.p));

  dependencies: Shape[] = $state([]);

  constructor(p: [number, number], q: [number, number]) {
    this.p = p;
    this.q = q;
    this.dependencies = [p, q];
  }
}

