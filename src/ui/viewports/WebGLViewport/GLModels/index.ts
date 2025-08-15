import type { WebGLViewport } from "../WebGLViewport.svelte.ts";
import type { GLModel } from "../GLModel.ts";
import { WorldAxes } from "./WorldAxes/WorldAxes.svelte.ts";
import { TouchIndicator } from "./TouchIndicator/TouchIndicator.svelte.ts";
import { CreasePatternEdges } from "./CreasePatternEdges/CreasePatternEdges.svelte.ts";
import { CreasePatternFaces } from "./CreasePatternFaces/CreasePatternFaces.svelte.ts";
import { FoldedFormFaces } from "./FoldedFormFaces/FoldedFormFaces.svelte.ts";
import { FoldedFormFaceOutlines } from "./FoldedFormFaceOutlines/FoldedFormFaceOutlines.svelte.ts";
import { FoldedFormEdges } from "./FoldedFormEdges/FoldedFormEdges.svelte.ts";

// the exported type is not a typeof Tool, because Tool
// is an abstract class, and we will be instancing actual
// class implementations. Otherwise typescript would yell at us
// for trying to instance an abstract class
type GLModelConstructor<T extends GLModel = GLModel> = new (viewport: WebGLViewport) => T;

const GLModels: { [key: string]: GLModelConstructor } = {};

[
  WorldAxes,
  TouchIndicator,
  CreasePatternEdges,
  CreasePatternFaces,
  FoldedFormFaces,
  FoldedFormFaceOutlines,
  FoldedFormEdges,
].forEach(Item => { GLModels[Item.name] = Item; });

export default GLModels;

