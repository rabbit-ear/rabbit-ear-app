import ear from "rabbit-ear";

export type Line = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Circle = {
  cx: number;
  cy: number;
  r: number;
};

export type Path = {
  d: string;
};

export type Shape = {
  name: string;
  params: Line | Rect | Circle | Path;
};

export const shapeToElement = ({ name, params }: Shape): SVGElement | undefined => {
  switch (name) {
    case "rect": {
      const rect = params as Rect;
      return ear.svg.rect(rect.x, rect.y, rect.width, rect.height);
    }
    case "line": {
      const line = params as Line;
      return ear.svg.line(line.x1, line.y1, line.x2, line.y2);
    }
    case "circle": {
      const circle = params as Circle;
      return ear.svg.circle(circle.cx, circle.cy, circle.r);
    }
    case "path": {
      return ear.svg.path((params as Path).d);
    }
    default:
      return undefined;
  }
};
