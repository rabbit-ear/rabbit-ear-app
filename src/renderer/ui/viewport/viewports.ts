import { FramesViewport } from "./FramesViewport/FramesViewport.svelte.ts";
import { ScriptViewport } from "./ScriptViewport/ScriptViewport.svelte.ts";
import { SimulatorViewport } from "./SimulatorViewport/SimulatorViewport.svelte.ts";
import { SVGViewport } from "./SVGViewport/SVGViewport.svelte.ts";
import { TerminalViewport } from "./TerminalViewport/TerminalViewport.svelte.ts";
import { WebGLViewport } from "./WebGLViewport/WebGLViewport.svelte.ts";

export type ModelViewportType =
  | typeof SVGViewport
  | typeof WebGLViewport
  | typeof SimulatorViewport;

export const ModelViewports = [SVGViewport, WebGLViewport, SimulatorViewport];

export const Viewport = [
  SVGViewport,
  WebGLViewport,
  SimulatorViewport,
  ScriptViewport,
  FramesViewport,
  TerminalViewport,
];
