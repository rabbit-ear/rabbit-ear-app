import type { Shape } from "../geometry/shapes.ts";
import { getShapesInRect, intersectAllShapes } from "../geometry/intersect.ts";

export class Geometry {
  shapes: Shape[] = $state([]);
  selected: number[] = $state([]);
  #effects: (() => void)[] = [];

  // snap points
  snapPoints: [number, number][] = $state([]);

  //selectedInsideRect(rect): void {
  selectedInsideRect(): void {
    //this.selected = getShapesInRect(this.shapes, rect);
    this.selected = getShapesInRect(this.shapes);
  }

  push(...newShapes: Shape[]): void {
    this.shapes.push(...newShapes);
  }
  pop(): void {
    this.shapes.pop();
  }
  clear(): void {
    this.shapes = [];
  }

  addSegment(x1: number, y1: number, x2: number, y2: number): void {
    this.shapes.push({ name: "line", params: { x1, y1, x2, y2 } });
  }
  addCircle(cx: number, cy: number, r: number): void {
    this.shapes.push({ name: "circle", params: { cx, cy, r } });
  }
  addRect(x: number, y: number, width: number, height: number): void {
    this.shapes.push({ name: "rect", params: { x, y, width, height } });
  }
  addPath({ d }: { d: string }): void {
    this.shapes.push({ name: "path", params: { d } });
  }

  setFromString(str: string): void {
    console.log(str);
  }

  valueAsString(): string {
    return `shape count: ${this.shapes.length}`;
  }

  #makeIntersectionsEffect(): () => void {
    return $effect.root(() => {
      $effect(() => {
        this.snapPoints = intersectAllShapes(this.shapes);
      });
      return () => {
        // empty
      };
    });
  }

  //loadExampleData(): void {
  //  this.shapes.push({ name: "circle", params: { cx: 0, cy: 0, r: 1 } });
  //  this.shapes.push({
  //    name: "circle",
  //    params: { cx: 0.5, cy: 0.5, r: Math.SQRT1_2 },
  //  });
  //  this.shapes.push({ name: "rect", params: { x: 0, y: 0, width: 1, height: 1 } });
  //  this.shapes.push({ name: "line", params: { x1: 0, y1: 0, x2: 1, y2: 1 } });
  //  this.shapes.push({ name: "line", params: { x1: 1, y1: 0, x2: 0, y2: 1 } });
  //}

  constructor() {
    this.#effects = [this.#makeIntersectionsEffect()];
    //this.loadExampleData();
  }

  dealloc(): void {
    this.#effects.forEach((fn) => fn());
  }
}
