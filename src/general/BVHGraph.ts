import type { FOLD } from "rabbit-ear/types.d.ts";
import type { AABB } from "./BVH.ts";
import { BVH2D } from "./BVH.ts";

export type VertexBVHType = {
  index: number,
  coords: [number, number],
  dist: number,
} | undefined;

export type EdgeBVHType = {
  index: number,
  coords: [[number, number], [number, number]],
  dist: number,
} | undefined;

export type FaceBVHType = {
  index: number,
  poly: [number, number][],
  dist: number,
} | undefined;

const distancePointToSegment = (
  e: { coords: [[number, number], [number, number]] },
  p: [number, number],
): number => {
  const vx = e.coords[1][0] - e.coords[0][0];
  const vy = e.coords[1][1] - e.coords[0][1];
  const wx = p[0] - e.coords[0][0];
  const wy = p[1] - e.coords[0][1];
  const t = Math.max(0, Math.min(1, (wx * vx + wy * vy) / (vx * vx + vy * vy)));
  const proj = [e.coords[0][0] + t * vx, e.coords[0][1] + t * vy];
  return Math.hypot(p[0] - proj[0], p[1] - proj[1]);
};

const polygonBox = ({ poly }: { poly: [number, number][] }): AABB => {
  const box: AABB = { min: [Infinity, Infinity], max: [-Infinity, -Infinity] };
  poly.forEach(pt => {
    box.min[0] = Math.min(box.min[0], pt[0]);
    box.min[1] = Math.min(box.min[1], pt[1]);
    box.max[0] = Math.max(box.max[0], pt[0]);
    box.max[1] = Math.max(box.max[1], pt[1]);
  })
  return box;
};

const clamp = (t: number, a: number, b: number): number => (
  t < a ? a : (t > b ? b : t)
);

const dist2PointPoint = (a: [number, number], b: [number, number]) => {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return dx * dx + dy * dy;
};

const closestPointOnSegment = (
  p: [number, number],
  a: [number, number],
  b: [number, number],
): { q: [number, number], t: number } => {
  const abx = b[0] - a[0], aby = b[1] - a[1];
  const ab2 = abx * abx + aby * aby;
  if (ab2 === 0) return { q: { ...a }, t: 0 };
  const t = clamp(((p[0] - a[0]) * abx + (p[1] - a[1]) * aby) / ab2, 0, 1);
  return { q: [a[0] + t * abx, a[1] + t * aby], t };
};

const dist2PointSegment = (
  p: [number, number],
  a: [number, number],
  b: [number, number],
) => {
  const { q } = closestPointOnSegment(p, a, b);
  return dist2PointPoint(p, q);
};

const pointInPolygon = (p: [number, number], verts: [number, number][]) => {
  // even-odd rule (ray cast)
  let inside = false;
  for (let i = 0, j = verts.length - 1; i < verts.length; j = i++) {
    const xi = verts[i][0];
    const yi = verts[i][1];
    const xj = verts[j][0];
    const yj = verts[j][1];
    const intersect = ((yi > p[1]) !== (yj > p[1])) &&
      (p[0] < (xj - xi) * (p[1] - yi) / (yj - yi + 0.0) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

const distancesToFace = ({ poly }: { poly: [number, number][] }, p: [number, number]) => {
  if (poly.length === 0) return Infinity;
  if (pointInPolygon(p, poly)) return 0;
  let best = Infinity;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const d2 = dist2PointSegment(p, a, b);
    if (d2 < best) best = d2;
  }
  return best;
};

export const VertexBVH = ({
  vertices_coords
}: FOLD): BVH2D<{ index: number, coords: [number, number] }> | undefined => {
  if (!vertices_coords) { return undefined; }
  return new BVH2D<{ index: number, coords: [number, number] }>(
    (vertices_coords ?? []).map((coords, index) => ({ coords, index })),
    (v) => ({ min: v.coords, max: v.coords }),
    (v, p) => Math.hypot(v.coords[0] - p[0], v.coords[1] - p[1])
  );
};

export const EdgeBVH = ({
  vertices_coords, edges_vertices
}: FOLD): BVH2D<{ index: number, coords: [[number, number], [number, number]] }> | undefined => {
  if (!vertices_coords || !edges_vertices) { return undefined; }
  const edges_coords: [[number, number], [number, number]][] = edges_vertices
    .map(verts => verts.map(v => vertices_coords[v]));
  return new BVH2D<{ index: number, coords: [[number, number], [number, number]] }>(
    edges_coords.map((coords, index) => ({ coords, index })),
    (e: { coords: [[number, number], [number, number]] }) => ({
      min: [
        Math.min(e.coords[0][0], e.coords[1][0]),
        Math.min(e.coords[0][1], e.coords[1][1]),
      ],
      max: [
        Math.max(e.coords[0][0], e.coords[1][0]),
        Math.max(e.coords[0][1], e.coords[1][1]),
      ],
    }),
    distancePointToSegment,
  );
};

export const FaceBVH = ({
  vertices_coords, faces_vertices
}: FOLD): BVH2D<{ index: number, poly: [number, number][] }> | undefined => {
  if (!vertices_coords || !faces_vertices) { return undefined; }
  const faces_coords: [number, number][][] = faces_vertices
    .map(verts => verts.map(v => vertices_coords[v]));
  return new BVH2D<{ index: number, poly: [number, number][] }>(
    faces_coords.map((poly, index) => ({ poly, index })),
    polygonBox,
    distancesToFace,
  );
};

