import type { Shape } from "../Shape.ts";
import type { Circle } from "rabbit-ear/types.js";
import type { Line } from "../Line.svelte";
import type { Ray } from "../Ray.svelte";
import type { Segment } from "../Segment.svelte";
import { intersectCircleCircle } from "./circleCircle.ts";
import { intersectCircleLine } from "./circleLine.ts";
import { intersectLineLine } from "./lineLine.ts";
import { include, includeL, includeS, includeR } from "rabbit-ear/math/compare.js";

export const intersectWithPoint = (point: [number, number], shape: Shape): [number, number][] => {
  return [];
}

export const intersectWithLine = (line: Line, shape: Shape): [number, number][] => {
  switch (shape.constructor.name) {
    case "Array": return [];
    case "Line": return intersectLineLine(line, shape as unknown as Line, includeL, includeL);
    case "Ray": return intersectLineLine(line, shape as unknown as Ray, includeL, includeR);
    case "Segment": return intersectLineLine(line, shape as unknown as Segment, includeL, includeS);
    case "Circle": return intersectCircleLine(shape as unknown as Circle, line, include, includeL);
    default: return [];
  }
}

export const intersectWithRay = (ray: Ray, shape: Shape): [number, number][] => {
  switch (shape.constructor.name) {
    case "Array": return [];
    case "Line": return intersectLineLine(ray, shape as unknown as Line, includeR, includeL);
    case "Ray": return intersectLineLine(ray, shape as unknown as Ray, includeR, includeR);
    case "Segment": return intersectLineLine(ray, shape as unknown as Segment, includeR, includeS);
    case "Circle": return intersectCircleLine(shape as unknown as Circle, ray, include, includeR);
    default: return [];
  }
}

export const intersectWithSegment = (segment: Segment, shape: Shape): [number, number][] => {
  switch (shape.constructor.name) {
    case "Array": return [];
    case "Line": return intersectLineLine(segment, shape as unknown as Line, includeS, includeL);
    case "Ray": return intersectLineLine(segment, shape as unknown as Ray, includeS, includeR);
    case "Segment": return intersectLineLine(segment, shape as unknown as Segment, includeS, includeS);
    case "Circle": return intersectCircleLine(shape as unknown as Circle, segment, include, includeS);
    default: return [];
  }
}

export const intersectWithCircle = (circle: Circle, shape: Shape): [number, number][] => {
  switch (shape.constructor.name) {
    case "Array": return [];
    case "Line": return intersectCircleLine(circle, shape as unknown as Line, include, includeL);
    case "Ray": return intersectCircleLine(circle, shape as unknown as Ray, include, includeR);
    case "Segment": return intersectCircleLine(circle, shape as unknown as Segment, include, includeS);
    case "Circle": return intersectCircleCircle(circle, shape as unknown as Circle);
    default: return [];
  }
}

export const intersect = (a: Shape, b: Shape): [number, number][] => {
  switch (a.constructor.name) {
    case "Line": return intersectWithLine(a as unknown as Line, b);
    case "Ray": return intersectWithRay(a as unknown as Ray, b);
    case "Segment": return intersectWithSegment(a as unknown as Segment, b);
    case "Circle": return intersectWithCircle(a as unknown as Circle, b);
    case "Point":
    case "Intersection":
    default: return [];
  }
};

