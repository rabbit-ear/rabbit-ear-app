import type { Component } from "svelte";
import type { IViewport, IModelViewport } from "./ViewportTypes.ts";
import { ScriptViewport } from "./ScriptViewport/ScriptViewport.svelte.ts";
import { SVGViewport } from "./SVGViewport/SVGViewport.svelte.ts";
import { TerminalViewport } from "./TerminalViewport/TerminalViewport.svelte.ts";
import { WebGLViewport } from "./WebGLViewport/WebGLViewport.svelte.ts";

type IViewportConstructor = new (...args: unknown[]) => IViewport;
type IModelViewportConstructor = new (...args: unknown[]) => IModelViewport;

interface IViewportConstructorWithStatics extends IViewportConstructor {
  panel?: Component;
  name?: string;
}
interface IModelViewportConstructorWithStatics extends IModelViewportConstructor {
  panel?: Component;
  name?: string;
}

// Now restrict ViewportClass to constructors that return an instance of IViewport
//export type ModelViewportTypes = SVGViewport | WebGLViewport | SimulatorViewport;
export type ModelViewportTypes = SVGViewport | WebGLViewport;

// Define the types of the classes
export type ModelViewportClassTypes = (typeof SVGViewport | typeof WebGLViewport) &
  IModelViewportConstructorWithStatics;

export type ViewportClassTypes = (
  | typeof SVGViewport
  | typeof WebGLViewport
  | typeof TerminalViewport
  | typeof ScriptViewport
) &
  IViewportConstructorWithStatics;

export const ModelViewports = [SVGViewport, WebGLViewport];

export const Viewports = [SVGViewport, WebGLViewport, ScriptViewport, TerminalViewport];
