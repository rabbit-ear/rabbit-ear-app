
const _0_866 = Math.sqrt(3) / 2;

export const emptySnapFunction = (
  point: [number, number],
  snapRadius: number,
): [number, number] | undefined => {
  return undefined;
};

export const triangleGridSnapFunction = (
  point: [number, number],
  snapRadius: number,
): [number, number] | undefined => {
  if (!point) {
    return undefined;
  }
  const yCoordCount = Math.round(point[1] / _0_866);
  const yCoord = yCoordCount * _0_866;
  const yRemainder = Math.abs(point[1] - yCoord);
  const xOffset = yCoordCount % 2 === 0 ? 0 : 0.5;
  const xCoord = Math.round(point[0] + xOffset) - xOffset;
  const xRemainder = Math.abs(point[0] - xCoord);
  return xRemainder < snapRadius && yRemainder < snapRadius
    ? [xCoord, yCoord]
    : undefined;
};

export const squareGridSnapFunction = (
  point: [number, number],
  snapRadius: number,
): [number, number] | undefined => {
  if (!point) {
    return undefined;
  }
  const rounded = point.map((n) => Math.round(n));
  const coords: [number, number] = [rounded[0], rounded[1]];
  const isNear = point
    .map((n, i) => Math.abs(coords[i] - n))
    .map((d) => d < snapRadius)
    .reduce((a, b) => a && b, true);
  return isNear ? coords : undefined;
};

