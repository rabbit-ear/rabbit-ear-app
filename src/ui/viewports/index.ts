import type { Viewport } from "./Viewport";
import { SVGViewport } from "./SVGViewport/SVGViewport.svelte";
import { WebGLViewport } from "./WebGLViewport/WebGLViewport.svelte";
import { StatusViewport } from "./StatusViewport/StatusViewport.svelte";

// the exported type is not a typeof Viewport, because Viewport
// is an abstract class, and we will be instancing actual
// class implementations. Otherwise typescript would yell at us
// for trying to instance an abstract class
type ViewportConstructor<T extends Viewport = Viewport> = new () => T;

const Viewports: { [key: string]: ViewportConstructor } = {
  SVGViewport,
  WebGLViewport,
  StatusViewport,
};

export default Viewports;
