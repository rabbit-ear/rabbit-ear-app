import context from "./context.svelte.ts";
import { FilesViewport } from "../ui/viewports/FilesViewport/FilesViewport.svelte.ts";
import { SVGViewport } from "../ui/viewports/SVGViewport/SVGViewport.svelte.ts";

export const defaultAppSetup = () => {
  console.log("running on boot", context.ui);
  // setup
  context.ui?.viewportManager.addViewport(new SVGViewport());
  context.ui?.viewportManager.addViewport(new SVGViewport());
};

