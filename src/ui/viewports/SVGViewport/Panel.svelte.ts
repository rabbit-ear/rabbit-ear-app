import type { Component } from "svelte";
import type { Panel } from "../../panels/Panel.ts";
import PanelComponent from "./PanelComponent.svelte";

export class SVGViewportPanel implements Panel {
  name: string = "SVG Viewport";

  component: Component = PanelComponent;
}

