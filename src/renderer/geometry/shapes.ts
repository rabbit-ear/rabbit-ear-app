import ear from "rabbit-ear";

export type Circle = {
  origin: [number, number, number];
  normal: [number, number, number];
  radius: number;
};

export type Line = {
  vector: [number, number, number];
  origin: [number, number, number];
};

export type Ray = Line;

export type Segment = [[number, number, number], [number, number, number]];

export type Polygon = [number, number, number][];

export type Polyline = Polygon;

export type Circle2D = {
  origin: [number, number];
  radius: number;
};

export type Line2D = {
  vector: [number, number];
  origin: [number, number];
};

export type Ray2D = Line2D;

export type Segment2D = [[number, number], [number, number]];

export type Polygon2D = [number, number][];

export type Polyline2D = Polygon2D;

// svg shapes

export type SVGLine = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type SVGRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type SVGCircle = {
  cx: number;
  cy: number;
  r: number;
};

export type SVGPath = {
  d: string;
};

export type Shape = {
  name: string;
  params: SVGLine | SVGRect | SVGCircle | SVGPath;
};

export const shapeToElement = ({ name, params }: Shape): SVGElement | undefined => {
  switch (name) {
    case "rect": {
      const rect = params as SVGRect;
      return ear.svg.rect(rect.x, rect.y, rect.width, rect.height);
    }
    case "line": {
      const line = params as SVGLine;
      return ear.svg.line(line.x1, line.y1, line.x2, line.y2);
    }
    case "circle": {
      const circle = params as SVGCircle;
      return ear.svg.circle(circle.cx, circle.cy, circle.r);
    }
    case "path": {
      return ear.svg.path((params as SVGPath).d);
    }
    default:
      return undefined;
  }
};
