import {
  add2,
  scale2,
  subtract2,
  resize2,
  add3,
  scale3,
  subtract3,
  resize3,
} from "rabbit-ear/math/vector.js";
import { getDimensionQuick } from "rabbit-ear/fold/spec.js";
import type { FOLDSelection } from "../general/selection.ts";

export const scaleVerticesCoords2 = (
  scaleAmount: number,
  origin: [number, number],
  vertices_coords: [number, number][],
  selection: FOLDSelection | undefined,
): [number, number][] => {
  if (selection && selection.vertices) {
    return vertices_coords.map((coord, i) => selection!.vertices!.has(i)
      ? add2(scale2(subtract2(coord, origin), scaleAmount), origin)
      : coord);
  }
  return vertices_coords.map((coord) =>
    add2(scale2(subtract2(coord, origin), scaleAmount), origin),
  );
};

export const scaleVerticesCoords3 = (
  scaleAmount: number,
  origin: [number, number, number],
  vertices_coords: [number, number, number][],
  selection: FOLDSelection | undefined,
): [number, number, number][] => {
  if (selection && selection.vertices) {
    return vertices_coords.map((coord, i) => selection!.vertices!.has(i)
      ? add3(scale3(subtract3(coord, origin), scaleAmount), origin)
      : coord);
  }
  return vertices_coords.map((coord) =>
    add3(scale3(subtract3(coord, origin), scaleAmount), origin),
  );
};

export const scaleVerticesCoords = (
  scaleAmount: number,
  origin: [number, number] | [number, number, number],
  vertices_coords: [number, number][] | [number, number, number][],
  selection: FOLDSelection | undefined,
): [number, number][] | [number, number, number][] => {
  switch (getDimensionQuick({ vertices_coords })) {
    case 2: return scaleVerticesCoords2(
      scaleAmount,
      resize2(origin),
      vertices_coords as [number, number][],
      selection);
    default: return scaleVerticesCoords3(
      scaleAmount,
      resize3(origin),
      vertices_coords as [number, number, number][],
      selection);
  }
};

export const translateVerticesCoords2 = (
  translation: [number, number],
  vertices_coords: [number, number][],
  selection: FOLDSelection | undefined,
): [number, number][] => {
  if (selection && selection.vertices) {
    return vertices_coords.map((coord, i) => selection!.vertices!.has(i)
      ? add2(coord, translation)
      : coord);
  }
  return vertices_coords.map((coord) => add2(coord, translation));
};

export const translateVerticesCoords3 = (
  translation: [number, number, number],
  vertices_coords: [number, number, number][],
  selection: FOLDSelection | undefined,
): [number, number, number][] => {
  if (selection && selection.vertices) {
    return vertices_coords.map((coord, i) => selection!.vertices!.has(i)
      ? add3(coord, translation)
      : coord);
  }
  return vertices_coords.map((coord) => add3(coord, translation));
};

export const translateVerticesCoords = (
  translation: [number, number] | [number, number, number],
  vertices_coords: [number, number][] | [number, number, number][],
  selection: FOLDSelection | undefined,
): [number, number][] | [number, number, number][] => {
  switch (getDimensionQuick({ vertices_coords })) {
    case 2: return translateVerticesCoords2(
      resize2(translation),
      vertices_coords as [number, number][],
      selection);
    default: return translateVerticesCoords3(
      resize3(translation),
      vertices_coords as [number, number, number][],
      selection);
  }
};

