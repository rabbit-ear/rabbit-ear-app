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
    case "Line": return intersectLineLine(line, shape, includeL, includeL);
    case "Ray": return intersectLineLine(line, shape, includeL, includeR);
    case "Segment": return intersectLineLine(line, shape, includeL, includeS);
    case "Circle": return intersectCircleLine(shape, line, include, includeL);
    default: return [];
  }
}

export const intersectWithRay = (ray: Ray, shape: Shape): [number, number][] => {
  switch (shape.constructor.name) {
    case "Array": return [];
    case "Line": return intersectLineLine(ray, shape, includeR, includeL);
    case "Ray": return intersectLineLine(ray, shape, includeR, includeR);
    case "Segment": return intersectLineLine(ray, shape, includeR, includeS);
    case "Circle": return intersectCircleLine(shape, line, include, includeR);
    default: return [];
  }
}

export const intersectWithSegment = (segment: Segment, shape: Shape): [number, number][] => {
  switch (shape.constructor.name) {
    case "Array": return [];
    case "Line": return intersectLineLine(segment, shape, includeS, includeL);
    case "Ray": return intersectLineLine(segment, shape, includeS, includeR);
    case "Segment": return intersectLineLine(segment, shape, includeS, includeS);
    case "Circle": return intersectCircleLine(shape, segment, include, includeS);
    default: return [];
  }
}

export const intersectWithCircle = (circle: Circle, shape: Shape): [number, number][] => {
  switch (shape.constructor.name) {
    case "Array": return [];
    case "Line": return intersectCircleLine(circle, shape, include, includeL);
    case "Ray": return intersectCircleLine(circle, shape, include, includeR);
    case "Segment": return intersectCircleLine(circle, shape, include, includeS);
    case "Circle": return intersectCircleCircle(circle, shape);
    default: return [];
  }
}

export const intersect = (a: Shape, b: Shape): [number, number][] => {
  switch (a.constructor.name) {
    case "Array": return intersectWithPoint(a, b);
    case "Line": return intersectWithLine(a, b);
    case "Ray": return intersectWithRay(a, b);
    case "Segment": return intersectWithSegment(a, b);
    case "Circle": return intersectWithCircle(a, b);
    default: return [];
  }
};

