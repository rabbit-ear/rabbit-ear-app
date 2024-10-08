const polarToCartesian = (a: number, d: number): [number, number] => [
  Math.cos(a) * d,
  Math.sin(a) * d,
];

export const arcPath = (
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  includeCenter = false,
): string => {
  if (endAngle == null) {
    return "";
  }
  const start = polarToCartesian(startAngle, radius);
  const end = polarToCartesian(endAngle, radius);
  const arcVec = [end[0] - start[0], end[1] - start[1]];
  const py = start[0] * end[1] - start[1] * end[0];
  const px = start[0] * end[0] + start[1] * end[1];
  const arcdir = Math.atan2(py, px) > 0 ? 0 : 1;
  let d = includeCenter
    ? `M ${x},${y} l ${start[0]},${start[1]} `
    : `M ${x + start[0]},${y + start[1]} `;
  d += ["a ", radius, radius, 0, arcdir, 1, arcVec[0], arcVec[1]].join(" ");
  if (includeCenter) {
    d += " Z";
  }
  return d;
};
