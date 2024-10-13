import ear from "rabbit-ear";
import type { FOLD } from "rabbit-ear/types.js";
import { subtract2 } from "rabbit-ear/math/vector.js";
import { intersectLineLine } from "rabbit-ear/math/intersect.js";
import { excludeS } from "rabbit-ear/math/compare.js";

export type Shape = {
  name: string;
  params: {
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    cx?: number;
    cy?: number;
    r?: number;
    d?: string;
  };
};

const intersectLines = (a, b): [number, number] => {
  const lineA = {
    vector: subtract2([a.x2, a.y2], [a.x1, a.y1]),
    origin: [a.x1, a.y1],
  };
  const lineB = {
    vector: subtract2([b.x2, b.y2], [b.x1, b.y1]),
    origin: [b.x1, b.y1],
  };
  const { point } = intersectLineLine(lineA, lineB, excludeS, excludeS);
  return point;
};

export const shapeToElement = ({ name, params }: Shape): SVGElement | undefined => {
  switch (name) {
    case "rect":
      return ear.svg.rect(params.x, params.y, params.width, params.height);
    case "line":
      return ear.svg.line(params.x1, params.y1, params.x2, params.y2);
    case "circle":
      return ear.svg.circle(params.cx, params.cy, params.r);
    case "path":
      return ear.svg.path(params.d);
    default:
      return undefined;
  }
};

// temporarily returns all circles, that's all.
//const getShapesInRect = (shapes: Shape[], rect): number[] => {
const getShapesInRect = (shapes: Shape[]): number[] => {
  return shapes
    .map(({ name }, i) => (name === "circle" ? i : undefined))
    .filter((a) => a !== undefined);
};

export class Geometry {
  shapes: Shape[] = $state([]);
  selected: number[] = $state([]);
  fold: FOLD = $state({});
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
        const results = [];
        for (let i = 0; i < this.shapes.length - 1; i += 1) {
          if (this.shapes[i].name !== "line") {
            continue;
          }
          for (let j = i + 1; j < this.shapes.length; j += 1) {
            if (this.shapes[j].name !== "line") {
              continue;
            }
            const result = intersectLines(this.shapes[i].params, this.shapes[j].params);
            if (result) {
              results.push(result);
            }
          }
        }
        this.snapPoints = results;
      });
      return () => {};
    });
  }

  loadExampleData(): void {
    this.shapes.push({ name: "circle", params: { cx: 0, cy: 0, r: 1 } });
    this.shapes.push({
      name: "circle",
      params: { cx: 0.5, cy: 0.5, r: Math.SQRT1_2 },
    });
    this.shapes.push({ name: "rect", params: { x: 0, y: 0, width: 1, height: 1 } });
    this.shapes.push({ name: "line", params: { x1: 0, y1: 0, x2: 1, y2: 1 } });
    this.shapes.push({ name: "line", params: { x1: 1, y1: 0, x2: 0, y2: 1 } });
  }

  constructor() {
    this.#effects = [this.#makeIntersectionsEffect()];
    this.loadExampleData();
  }

  dealloc(): void {
    this.#effects.forEach((fn) => fn());
  }
}
