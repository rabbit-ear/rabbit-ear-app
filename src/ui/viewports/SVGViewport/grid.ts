import { scale2, dot2, add2 } from "rabbit-ear/math/vector.js";

const _0_866 = Math.sqrt(3) / 2;

/**
 * @description create a set of evenly spaced intervals that fit
 * inside the viewbox, one dimension at a time.
 * @param {number} start the viewbox corner (origin, x or y)
 * @param {number} size the viewbox size (width or height)
 */
export const makeIntervals = (
  start: number,
  size: number,
  spacing = 1,
  max = 128,
): number[] => {
  while (size / spacing > max) {
    spacing *= 2;
  }
  const count = Math.floor(size / spacing);
  const offset = Math.ceil(start / spacing) * spacing;
  // todo: got an "invalid array length" error.
  try {
    return Array.from(Array(count + 1)).map((_, i) => offset + spacing * i);
  } catch {
    console.log("ERROR: makeIntervals", start, size, spacing, count, offset);
    return [];
  }
};

// note: for both makeSquareGrid and makeHexGrid
// the viewbox/viewport for an origami is a tight bounding box around
// the model, but the css rules will aspect-fit this rectangle inside the
// div for the canvas and the svg will vertically/horizontally fill the
// remaining space.
// this leaves a lot of dead space, the size of which is not informed by
// the viewbox/viewport. so, a quick fix is to increase the size of the
// viewport by one width and height unit on either side. this works for
// all reasonable cases (it fails when the user squishes the window extremly
// far in one axis only).
// a solution for this would be to use javascript to read the rendered size
// of the container div housing the SVG or the SVG itself, and relay this
// to the viewport to resize it in these equations only.

type SVGLine = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export const makeSquareGrid = (
  viewBoxArray: [number, number, number, number],
): SVGLine[] => {
  // calculate correct spacing ahead of time
  const size = Math.max(viewBoxArray[2] * 3, viewBoxArray[3] * 4);
  let spacing = 1;
  while (size / spacing > 256) {
    spacing *= 2;
  }
  return [
    makeIntervals(
      viewBoxArray[0] - viewBoxArray[2] * 1,
      viewBoxArray[2] * 3,
      spacing,
      256,
    ).map((x) => ({
      x1: x,
      y1: viewBoxArray[1] - viewBoxArray[3],
      x2: x,
      y2: viewBoxArray[1] + viewBoxArray[3] * 3,
    })),
    makeIntervals(
      viewBoxArray[1] - viewBoxArray[3] * 1,
      viewBoxArray[3] * 4,
      spacing,
      256,
    ).map((y) => ({
      x1: viewBoxArray[0] - viewBoxArray[2],
      y1: y,
      x2: viewBoxArray[0] + viewBoxArray[2] * 2,
      y2: y,
    })),
  ].flat();
};

export const makeTriangleGrid = (
  viewport: [number, number, number, number],
): SVGLine[] => {
  // the result of this method are 3 sets of parallel lines,
  // one horizontal set and two diagonal sets.
  //    a   /     \   b
  //      /         \
  //    /             \
  // a vector and b vector are not the vectors of the visible lines,
  // these are perpendicular to the visible lines
  const aVector: [number, number] = [_0_866, 0.5];
  const bVector: [number, number] = [-_0_866, 0.5];
  // the normal vectors ARE the vectors that trace out the visible lines
  const aNormal: [number, number] = [-0.5, _0_866];
  const bNormal: [number, number] = [0.5, _0_866];
  // four corner points. depending on the y-axis inversion, they might not
  // acutually be "min" or "max".
  // pad the corners to add another width and height to the actual viewbox
  const corners: [number, number][] = [
    [viewport[0] - viewport[2] * 1, viewport[1] - viewport[3] * 1],
    [viewport[0] - viewport[2] * 1, viewport[1] + viewport[3] * 3],
    [viewport[0] + viewport[2] * 3, viewport[1] - viewport[3] * 1],
    [viewport[0] + viewport[2] * 3, viewport[1] + viewport[3] * 3],
  ];
  // for each diagonal, project points onto the diagonal axis.
  // sort them so the smaller is first, this will normalize any y-axis inversion.
  // do this with both the diagonal line vectors, and their normals.
  // this gives us the drawing space on screen that needs to be covered.
  const aVecProject = corners.map((p) => dot2(p, aVector)).sort((a, b) => a - b);
  const bVecProject = corners.map((p) => dot2(p, bVector)).sort((a, b) => a - b);
  const aNormProject = corners.map((p) => dot2(p, aNormal)).sort((a, b) => a - b);
  const bNormProject = corners.map((p) => dot2(p, bNormal)).sort((a, b) => a - b);
  const aVecLength = aVecProject[aVecProject.length - 1] - aVecProject[0];
  const bVecLength = bVecProject[bVecProject.length - 1] - bVecProject[0];
  // create three interval arrays, one for each axis, each number is the
  // location along that vector's axis which to draw a perpendicular line.
  const horizontalIntervals = makeIntervals(
    viewport[1] - viewport[3] * 1,
    viewport[3] * 4,
    _0_866,
    128,
  );
  const aIntervals = makeIntervals(aVecProject[0], aVecLength, _0_866, 128);
  const bIntervals = makeIntervals(bVecProject[0], bVecLength, _0_866, 128);
  // the horizontal centers can be read from the viewport.
  // the diagonal centers are a point along the line through the origin
  // that travels along the line perpendicular to the drawn lines.
  const aCenters = aIntervals.map((n) => scale2(aVector, n));
  const bCenters = bIntervals.map((n) => scale2(bVector, n));
  // the normal projections are the locations along the normal line that fit
  // inside the screen; scale the normal by these values and add them to the
  // center point and this gives us the segment of the line visible on screen
  const aSegments = aCenters.map((center) => [
    add2(center, scale2(aNormal, aNormProject[0])),
    add2(center, scale2(aNormal, aNormProject[aNormProject.length - 1])),
  ]);
  const bSegments = bCenters.map((center) => [
    add2(center, scale2(bNormal, bNormProject[0])),
    add2(center, scale2(bNormal, bNormProject[bNormProject.length - 1])),
  ]);
  // convert all segments into svg <line> attribute form.
  const aDiagonals = aSegments.map((s) => ({
    x1: s[0][0],
    y1: s[0][1],
    x2: s[1][0],
    y2: s[1][1],
  }));
  const bDiagonals = bSegments.map((s) => ({
    x1: s[0][0],
    y1: s[0][1],
    x2: s[1][0],
    y2: s[1][1],
  }));
  const horizontals = horizontalIntervals.map((y) => ({
    x1: viewport[0] - viewport[2],
    y1: y,
    x2: viewport[0] + viewport[2] * 2,
    y2: y,
  }));
  return horizontals.concat(aDiagonals).concat(bDiagonals);
};

