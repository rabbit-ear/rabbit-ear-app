import context from "./context.svelte.ts";
import { StatusViewport } from "../ui/viewports/StatusViewport/StatusViewport.svelte.ts";
import { SVGViewport } from "../ui/viewports/SVGViewport/SVGViewport.svelte.ts";

export const defaultAppSetup = () => {
  // setup
  context.ui?.viewportManager.addViewport(new SVGViewport());
  // context.ui?.viewportManager.addViewport(new SVGViewport());
  context.ui?.viewportManager.addViewport(new StatusViewport());
};

