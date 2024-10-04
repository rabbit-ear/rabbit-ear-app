import ear from "rabbit-ear";
import type { FOLD } from "rabbit-ear/types.js";
//import snap from "./snap.svelte.ts";
import { subtract2 } from "rabbit-ear/math/vector.js";
import { intersectLineLine } from "rabbit-ear/math/intersect.js";
import { excludeS } from "rabbit-ear/math/compare.js";

export type Shape = {
  name: string;
  params: object;
};

const intersectLines = (a, b) => {
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

export const shapeToElement = ({ name, params }: Shape) => {
  switch (name) {
    case "rect":
      return ear.svg.rect(params.x, params.y, params.width, params.height);
    case "line":
      return ear.svg.line(params.x1, params.y1, params.x2, params.y2);
    case "circle":
      return ear.svg.circle(params.cx, params.cy, params.r);
    case "path":
      return ear.svg.path(params.d);
  }
};

// temporarily returns all circles, that's all.
const getShapesInRect = (shapes: Shape[], rect): number[] => {
  return shapes
    .map(({ name }, i) => (name === "circle" ? i : undefined))
    .filter((a) => a !== undefined);
};

export class Model {
  shapes: Shape[] = $state([]);
  selected: number[] = $state([]);
  fold: FOLD = $state({});
  #effects: Function[] = [];

  // snap points
  snapPoints: [number, number][] = $state([]);

  selectedInsideRect(rect) {
    this.selected = getShapesInRect(this.shapes, rect);
  }

  push(...newShapes: Shape[]) {
    this.shapes.push(...newShapes);
  }
  pop() {
    this.shapes.pop();
  }
  clear() {
    this.shapes = [];
  }

  addLine(x1: number, y1: number, x2: number, y2: number) {
    this.shapes.push({ name: "line", params: { x1, y1, x2, y2 } });
  }
  addCircle(cx: number, cy: number, r: number) {
    this.shapes.push({ name: "circle", params: { cx, cy, r } });
  }
  addRect(x: number, y: number, width: number, height: number) {
    this.shapes.push({ name: "rect", params: { x, y, width, height } });
  }
  addPath({ d }: { d: string }) {
    this.shapes.push({ name: "path", params: { d } });
  }

  #makeIntersectionsEffect() {
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
      return () => { };
    });
  }

  constructor() {
    this.#effects = [this.#makeIntersectionsEffect()];
  }
}

//export const model = new Model();

// export const Reset = () => {
// 	RecalculateModelMatrix();
// 	Selection.reset();
// 	FrameIndex.set(0);
// 	FileMetadata.set(getFileMetadata(FOLD));
// 	Frames.set(frames);
// 	CameraMatrix.reset();
// };

